import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { VFS, VFSNode, VFSFile, VFSDirectory } from '../types';
import { HoustonIcon } from '../components/Icons';
import { API_KEY } from '../config';

interface CodexProps {
    vfs: VFS;
    onCreateNode: (parentPath: string, name: string, type: 'file' | 'directory', content?: string) => void;
    onUpdateNodeContent: (path: string, content: string) => void;
    onDeleteNode: (path: string) => void;
    onRenameNode: (path: string, newName: string) => void;
    onApiCall?: () => void;
}

type HoustonAction = 'explain' | 'refactor' | 'debug';

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

const Codex: React.FC<CodexProps> = (props) => {
    const { vfs, onCreateNode, onUpdateNodeContent, onDeleteNode, onRenameNode, onApiCall } = props;
    const [activeFilePath, setActiveFilePath] = useState<string | null>('/Documents/index.html');
    const [code, setCode] = useState('');
    const [isHoustonPanelVisible, setHoustonPanelVisible] = useState(false);
    const [houstonResponse, setHoustonResponse] = useState('');
    const [isHoustonLoading, setIsHoustonLoading] = useState(false);

    // Create a default project if it doesn't exist
    // FIX: Use `useEffect` directly now that it's imported.
    useEffect(() => {
        const docsNode = findVFSNodeByPath(vfs, '/Documents') as VFSDirectory;
        if (docsNode && !Object.values(docsNode.children).some(c => c.name === 'index.html')) {
            onCreateNode('/Documents', 'index.html', 'file', `<!DOCTYPE html>
<html>
<head>
    <title>My Site</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Hello, World!</h1>
    <script src="script.js"></script>
</body>
</html>`);
            onCreateNode('/Documents', 'style.css', 'file', `body {
    font-family: sans-serif;
    background-color: #f0f0f0;
    color: #333;
}`);
            onCreateNode('/Documents', 'script.js', 'file', `console.log('Hello from ArsisOS Codex!');`);
        }
    }, [vfs, onCreateNode]);

    const activeFile = useMemo(() => activeFilePath ? findVFSNodeByPath(vfs, activeFilePath) as VFSFile : null, [activeFilePath, vfs]);

    useEffect(() => {
        if (activeFile) {
            setCode(activeFile.content);
        }
    }, [activeFile]);

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
        if (activeFilePath) {
            onUpdateNodeContent(activeFilePath, newCode);
        }
    };

    const FileTree: React.FC<{ dir: VFSDirectory, path: string }> = ({ dir, path }) => (
        <ul className="pl-2">
            {Object.values(dir.children).map(node => {
                const fullPath = `${path}/${node.name}`;
                return (
                    <li key={node.id}>
                        <button
                            onClick={() => node.type === 'file' && setActiveFilePath(fullPath)}
                            className={`w-full text-left text-sm p-1 rounded ${activeFilePath === fullPath ? 'bg-blue-500/30' : 'hover:bg-gray-700'}`}
                        >
                            {node.name}
                        </button>
                    </li>
                );
            })}
        </ul>
    );

    const handleHoustonAction = async (action: HoustonAction) => {
        if (!code.trim()) return;
        setHoustonPanelVisible(true);
        setIsHoustonLoading(true);
        setHoustonResponse('');
        onApiCall?.();

        const lang = activeFile?.name.split('.').pop() || 'code';
        let prompt = '';
        switch(action) {
            case 'explain': prompt = `Explain the following ${lang} code:\n\n\`\`\`${lang}\n${code}\n\`\`\``; break;
            case 'refactor': prompt = `Refactor the following ${lang} code for clarity and efficiency:\n\n\`\`\`${lang}\n${code}\n\`\`\``; break;
            case 'debug': prompt = `Find and fix bugs in the following ${lang} code:\n\n\`\`\`${lang}\n${code}\n\`\`\``; break;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setHoustonResponse(response.text);
        } catch (e) {
            setHoustonResponse("An error occurred. Please try again.");
        } finally {
            setIsHoustonLoading(false);
        }
    };
    
    return (
        <div className="w-full h-full flex bg-gray-800 text-white font-mono">
            {/* File Sidebar */}
            <div className="w-48 flex-shrink-0 bg-gray-900/70 p-2 flex flex-col">
                <h2 className="font-bold text-center mb-2">Files</h2>
                <div className="flex-grow overflow-y-auto">
                    <FileTree dir={findVFSNodeByPath(vfs, '/Documents') as VFSDirectory} path="/Documents" />
                </div>
            </div>
            
            {/* Editor & Preview */}
            <div className="flex-grow flex flex-col">
                <div className="flex-grow flex h-1/2">
                    <div className="w-1/2 h-full flex flex-col">
                        <textarea
                            value={code}
                            onChange={(e) => handleCodeChange(e.target.value)}
                            className="w-full h-full bg-[#1e1e1e] p-2 focus:outline-none resize-none"
                            placeholder="Select a file to start coding..."
                        />
                         <div className="flex-shrink-0 bg-gray-700 p-1 flex items-center space-x-2">
                             <span className="text-xs text-gray-400">{activeFilePath || 'No file selected'}</span>
                             <div className="flex-grow" />
                             <button onClick={() => handleHoustonAction('explain')} title="Explain Code" className="p-1 hover:bg-gray-600 rounded"><HoustonIcon className="w-4 h-4"/></button>
                             <button onClick={() => handleHoustonAction('refactor')} title="Refactor Code" className="p-1 hover:bg-gray-600 rounded"><HoustonIcon className="w-4 h-4"/></button>
                             <button onClick={() => handleHoustonAction('debug')} title="Debug Code" className="p-1 hover:bg-gray-600 rounded"><HoustonIcon className="w-4 h-4"/></button>
                         </div>
                    </div>
                    <iframe
                        srcDoc={code}
                        title="Code Preview"
                        className="w-1/2 h-full bg-white border-l-2 border-gray-700"
                        sandbox="allow-scripts"
                    />
                </div>
                {isHoustonPanelVisible && (
                    <div className="flex-shrink-0 h-1/2 bg-gray-900 border-t-2 border-gray-700 p-2 flex flex-col">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="font-bold">Houston Assistant</h3>
                            <button onClick={() => setHoustonPanelVisible(false)} className="text-xs">Close</button>
                        </div>
                        <div className="flex-grow overflow-y-auto bg-[#1e1e1e] p-2 rounded whitespace-pre-wrap">
                            {isHoustonLoading ? 'Thinking...' : houstonResponse}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Codex;
