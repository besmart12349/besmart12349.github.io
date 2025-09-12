import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import type { VFS, VFSNode, VFSDirectory, VFSFile, AppID } from '../types';
import { PagesIcon, TerminalIcon } from '../components/Icons';

const FolderIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 text-blue-500 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const FileIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 text-gray-400 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const AppInstallIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 text-indigo-400 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;


const findVFSNodeByPath = (vfs: VFS, path: string): VFSNode | null => {
    if (path === '/') return vfs;
    const parts = path.split('/').filter(p => p);
    let currentNode: VFSNode = vfs;
    for (const part of parts) {
        if (currentNode.type !== 'directory') return null;
        const children = (currentNode as VFSDirectory).children;
        const nextNode = Object.values(children).find(c => c.name === part);
        if (!nextNode) return null;
        currentNode = nextNode;
    }
    return currentNode;
};

interface FinderProps {
    vfs: VFS;
    onOpenFile: (filePath: string) => void;
    onCreateNode: (parentPath: string, name: string, type: 'file' | 'directory', content?: string) => void;
    onDeleteNode: (path: string) => void;
    onRenameNode: (path: string, newName: string) => void;
    openApp: (appId: AppID, initialProps: any) => void;
}

const Finder: React.FC<FinderProps> = ({ vfs, onOpenFile, onCreateNode, onDeleteNode, onRenameNode, openApp }) => {
    const [currentPath, setCurrentPath] = useState('/Desktop');
    const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number; targetPath?: string; type?: 'file' | 'dir' | 'background' }>({ visible: false, x: 0, y: 0 });
    const [renamingPath, setRenamingPath] = useState<string | null>(null);
    const renameInputRef = useRef<HTMLInputElement>(null);

    const currentDirectory = useMemo(() => findVFSNodeByPath(vfs, currentPath) as VFSDirectory | null, [vfs, currentPath]);
    const items = useMemo(() => currentDirectory ? Object.values(currentDirectory.children) : [], [currentDirectory]);

    useEffect(() => {
        if (renamingPath && renameInputRef.current) {
            renameInputRef.current.focus();
            renameInputRef.current.select();
        }
    }, [renamingPath]);
    
    const closeAllModals = useCallback(() => {
        setContextMenu({ visible: false, x: 0, y: 0 });
        if (renamingPath) {
            setRenamingPath(null);
        }
    }, [renamingPath]);

    useEffect(() => {
        const handleClickOutside = () => closeAllModals();
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [closeAllModals]);

    const handleContextMenu = (e: React.MouseEvent, targetNode?: VFSNode) => {
        e.preventDefault();
        e.stopPropagation();
        closeAllModals();
        const targetPath = targetNode ? `${currentPath === '/' ? '' : currentPath}/${targetNode.name}` : undefined;
        const type = targetNode ? (targetNode.type === 'directory' ? 'dir' : 'file') : 'background';
        setContextMenu({ visible: true, x: e.clientX, y: e.clientY, targetPath, type });
    };

    const handleItemDoubleClick = (node: VFSNode) => {
        const fullPath = `${currentPath === '/' ? '' : currentPath}/${node.name}`;
        if (node.type === 'directory') {
            setCurrentPath(fullPath);
        } else {
            onOpenFile(fullPath);
        }
    };
    
    const handleRenameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (renamingPath && renameInputRef.current) {
            onRenameNode(renamingPath, renameInputRef.current.value);
        }
        setRenamingPath(null);
    }
    
    const menuAction = (action: () => void) => {
        action();
        closeAllModals();
    };

    const handleSaveToMaverick = () => {
        if (!contextMenu.targetPath) return;
        const fileNode = findVFSNodeByPath(vfs, contextMenu.targetPath) as VFSFile;
        if (!fileNode || fileNode.type !== 'file') return;
        
        try {
            const base64Content = btoa(fileNode.content);
            const dataUrl = `data:text/html;base64,${base64Content}`;
            openApp('maverick', { initialUrl: dataUrl });
        } catch (e) {
            console.error("Error encoding file content:", e);
        }
    };

    const getIconForFile = (fileName: string) => {
        if (fileName.endsWith('.txt') || fileName.endsWith('.md')) return <PagesIcon className="w-12 h-12" />;
        if (fileName.endsWith('.arsapp')) return <AppInstallIcon className="w-12 h-12" />;
        return <FileIcon className="w-12 h-12" />;
    };

    const ContextMenuComponent = () => {
        if (!contextMenu.visible) return null;
        return (
            <div
                className="fixed bg-white/60 backdrop-blur-xl rounded-md shadow-lg border border-white/50 py-1 z-10 dark:bg-gray-800/60 dark:border-gray-700/50"
                style={{ top: contextMenu.y, left: contextMenu.x }}
                onClick={(e) => e.stopPropagation()}
            >
                {contextMenu.type === 'background' && (
                    <>
                        <button onClick={() => menuAction(() => {
                           const name = prompt("Enter new file name:", "Untitled.txt");
                           if (name) onCreateNode(currentPath, name, 'file', 'Hello world!');
                        })} className="block w-full text-left px-4 py-1.5 text-sm hover:bg-blue-500 hover:text-white dark:text-white">New File</button>
                        <button onClick={() => menuAction(() => {
                           const name = prompt("Enter new folder name:", "Untitled Folder");
                           if (name) onCreateNode(currentPath, name, 'directory');
                        })} className="block w-full text-left px-4 py-1.5 text-sm hover:bg-blue-500 hover:text-white dark:text-white">New Folder</button>
                    </>
                )}
                {contextMenu.targetPath && (
                    <>
                        <button onClick={() => menuAction(() => {
                            const node = findVFSNodeByPath(vfs, contextMenu.targetPath!);
                            if (node) handleItemDoubleClick(node);
                        })} className="block w-full text-left px-4 py-1.5 text-sm hover:bg-blue-500 hover:text-white dark:text-white">Open</button>
                        <div className="my-1 h-px bg-gray-400/30 dark:bg-gray-600/30"></div>
                        {contextMenu.type === 'file' && (
                            <button onClick={() => menuAction(handleSaveToMaverick)} className="block w-full text-left px-4 py-1.5 text-sm hover:bg-blue-500 hover:text-white dark:text-white">Save to Maverick</button>
                        )}
                        <button onClick={() => menuAction(() => setRenamingPath(contextMenu.targetPath!))} className="block w-full text-left px-4 py-1.5 text-sm hover:bg-blue-500 hover:text-white dark:text-white">Rename</button>
                        <button onClick={() => menuAction(() => {
                            if (window.confirm("Are you sure you want to delete this item?")) onDeleteNode(contextMenu.targetPath!);
                        })} className="block w-full text-left px-4 py-1.5 text-sm hover:bg-blue-500 text-red-600 hover:text-white dark:text-red-400">Delete</button>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="w-full h-full bg-gray-50 flex dark:bg-gray-800 dark:text-white" onClick={closeAllModals}>
            <div className="w-48 flex-shrink-0 bg-gray-200/50 dark:bg-gray-900/50 border-r border-gray-300/60 dark:border-gray-700/60 p-2 space-y-1">
                <h2 className="px-2 text-xs font-bold text-gray-500 uppercase">Favorites</h2>
                {['Desktop', 'Documents', 'Pictures'].map(fav => (
                    <button key={fav} onClick={() => setCurrentPath(`/${fav}`)} className={`w-full text-left flex items-center space-x-2 px-2 py-1 rounded-md text-sm ${currentPath === `/${fav}` ? 'bg-blue-500 text-white' : 'hover:bg-gray-300/50 dark:hover:bg-gray-700/50'}`}>
                        <FolderIcon className="w-5 h-5" />
                        <span>{fav}</span>
                    </button>
                ))}
            </div>
            <div className="flex-grow overflow-auto p-4" onContextMenu={(e) => handleContextMenu(e)}>
                <div className="grid grid-cols-auto-fill-100 gap-4">
                    {items.map(item => {
                        const fullPath = `${currentPath === '/' ? '' : currentPath}/${item.name}`;
                        return (
                            <div key={item.id}
                                onDoubleClick={() => handleItemDoubleClick(item)}
                                onContextMenu={(e) => handleContextMenu(e, item)}
                                className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-blue-500/10 cursor-pointer"
                            >
                                {item.type === 'directory' ? <FolderIcon /> : getIconForFile(item.name)}

                                {renamingPath === fullPath ? (
                                    <form onSubmit={handleRenameSubmit}>
                                        <input
                                            ref={renameInputRef}
                                            defaultValue={item.name}
                                            onBlur={handleRenameSubmit}
                                            onClick={e => e.stopPropagation()}
                                            className="w-24 text-center text-sm bg-white dark:bg-gray-900 border border-blue-500 rounded-sm"
                                        />
                                    </form>
                                ) : (
                                    <span className="text-xs text-center break-all w-24 truncate">{item.name}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <ContextMenuComponent />
        </div>
    );
};

export default Finder;
