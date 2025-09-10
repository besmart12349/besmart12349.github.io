import React, { useState } from 'react';
import type { InstalledApp } from '../types';

const FileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const AppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>;

interface MyDocsProps {
    onOpenFile?: (fileHandle: FileSystemFileHandle) => void;
    onInstallApp?: (manifest: InstalledApp) => void;
}

type View = 'files' | 'apps';

// Sample .arsapp content for download
const sampleArsapp = {
    id: "system-monitor-app",
    title: "System Monitor",
    componentId: "system-monitor",
    iconId: "system-monitor",
    width: 400,
    height: 300
};

const MyDocs: React.FC<MyDocsProps> = ({ onOpenFile, onInstallApp }) => {
  const [view, setView] = useState<View>('apps');
  const [items, setItems] = useState<(FileSystemFileHandle | FileSystemDirectoryHandle)[]>([]);
  const [currentDirName, setCurrentDirName] = useState<string>('');
  const [installError, setInstallError] = useState('');

  const openDirectory = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      setCurrentDirName(dirHandle.name);
      const newItems = [];
      for await (const entry of dirHandle.values()) {
        newItems.push(entry);
      }
      // Sort folders first, then alphabetically
      newItems.sort((a, b) => {
        if (a.kind === b.kind) {
          return a.name.localeCompare(b.name);
        }
        return a.kind === 'directory' ? -1 : 1;
      });
      setItems(newItems);
    } catch (e) {
      console.error("User cancelled or failed to open directory", e);
    }
  };

  const handleItemDoubleClick = (item: FileSystemFileHandle | FileSystemDirectoryHandle) => {
    if (item.kind === 'file' && onOpenFile) {
        if (item.name.endsWith('.txt') || item.name.endsWith('.md')) {
            onOpenFile(item as FileSystemFileHandle);
        } else {
            alert('This file type is not supported for opening.');
        }
    }
    // Could add directory navigation logic here
  };

  const handleInstallFromFile = async () => {
    setInstallError('');
    try {
        const [fileHandle] = await window.showOpenFilePicker({
            types: [{ description: 'ArsisOS Apps', accept: { 'application/json': ['.arsapp'] } }],
        });
        const file = await fileHandle.getFile();
        const text = await file.text();
        const manifest = JSON.parse(text);
        onInstallApp?.(manifest);
    } catch (err: any) {
        if (err.name !== 'AbortError') {
             console.error("Failed to install app:", err);
             setInstallError('Could not read or parse the file.');
        }
    }
  };

  const downloadSampleApp = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sampleArsapp, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "system-monitor.arsapp");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  const FileBrowserView = () => (
    <>
      <header className="flex-shrink-0 p-2 border-b bg-gray-100 flex items-center space-x-2 dark:bg-gray-900 dark:border-gray-700">
        <button onClick={openDirectory} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">
          Open Directory
        </button>
        {currentDirName && <span className="text-sm text-gray-700 dark:text-gray-300">Current: <strong>{currentDirName}</strong></span>}
      </header>
      
      <div className="p-2 text-xs text-center bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
        Note: Files downloaded from web apps are saved to your computer's main 'Downloads' folder.
      </div>

      {items.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <FolderIcon />
          <p className="mt-2">No directory selected.</p>
          <p className="text-xs">Click "Open Directory" to browse local files.</p>
        </div>
      ) : (
        <div className="flex-grow overflow-auto p-2">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-2 rounded-tl-lg">Name</th>
                <th className="p-2 rounded-tr-lg">Type</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr 
                  key={item.name} 
                  className="hover:bg-blue-100 dark:hover:bg-blue-900/50 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
                  onDoubleClick={() => handleItemDoubleClick(item)}
                >
                  <td className="p-2 flex items-center space-x-3">
                    {item.kind === 'directory' ? <FolderIcon /> : <FileIcon />}
                    <span>{item.name}</span>
                  </td>
                  <td className="p-2 capitalize text-gray-600 dark:text-gray-400">{item.kind}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  const ApplicationsView = () => (
     <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <AppIcon />
        <h2 className="text-xl font-bold mt-2">Install Local Apps</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mt-1 mb-6">
            Install custom applications built for ArsisOS by selecting a <code>.arsapp</code> manifest file. These apps run locally without the browser sandbox.
        </p>

        <div className="space-y-4">
             <button onClick={handleInstallFromFile} className="px-5 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-500 font-semibold">
                Install from File...
            </button>
             <button onClick={downloadSampleApp} className="block mx-auto text-xs text-blue-500 hover:underline">
                Download Sample App (System Monitor)
            </button>
            {installError && <p className="text-red-500 text-xs mt-2">{installError}</p>}
        </div>
    </div>
  );

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col dark:bg-gray-800 dark:text-white">
        <div className="flex-shrink-0 flex border-b dark:border-gray-700">
            <button onClick={() => setView('apps')} className={`px-4 py-2 text-sm flex items-center space-x-2 ${view === 'apps' ? 'bg-white dark:bg-gray-800 border-b-2 border-blue-500' : 'bg-gray-100 dark:bg-gray-900 text-gray-500'}`}>
                <AppIcon /><span>Applications</span>
            </button>
            <button onClick={() => setView('files')} className={`px-4 py-2 text-sm flex items-center space-x-2 ${view === 'files' ? 'bg-white dark:bg-gray-800 border-b-2 border-blue-500' : 'bg-gray-100 dark:bg-gray-900 text-gray-500'}`}>
                <FolderIcon /><span>File Browser</span>
            </button>
        </div>
        <div className="flex-grow overflow-auto">
            {view === 'apps' ? <ApplicationsView /> : <FileBrowserView />}
        </div>
    </div>
  );
};

export default MyDocs;
