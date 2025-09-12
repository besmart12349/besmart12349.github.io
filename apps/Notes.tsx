import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { VFS, VFSFile } from '../types';
import { HoustonIcon } from '../components/Icons';
import { API_KEY } from '../config';

interface PagesProps {
  vfs: VFS;
  initialPath?: string;
  onUpdateNodeContent: (path: string, content: string) => void;
  onCreateNode: (parentPath: string, name: string, type: 'file' | 'directory', content?: string) => void;
  onDeleteNode: (path: string) => void;
  onRenameNode: (path: string, newName: string) => void;
  onApiCall?: () => void;
}

type HoustonAction = 'complete' | 'summarize' | 'fix';

const Pages: React.FC<PagesProps> = (props) => {
  const { vfs, initialPath, onUpdateNodeContent, onCreateNode, onDeleteNode, onRenameNode, onApiCall } = props;

  const documents = useMemo(() => {
    const docsDir = Object.values(vfs.children).find(c => c.name === 'Documents');
    if (docsDir && docsDir.type === 'directory') {
      return Object.values(docsDir.children).filter(c => c.type === 'file') as VFSFile[];
    }
    return [];
  }, [vfs]);
  
  const [activeFilePath, setActiveFilePath] = useState<string | null>(initialPath || (documents[0] ? `/Documents/${documents[0].name}` : null));
  const [isHoustonLoading, setIsHoustonLoading] = useState(false);
  const [activeHoustonAction, setActiveHoustonAction] = useState<HoustonAction | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const activeFile = useMemo(() => {
    if (!activeFilePath) return null;
    const parts = activeFilePath.split('/').filter(Boolean);
    if (parts.length !== 2) return null;
    const parent = vfs.children[parts[0]];
    if (parent?.type === 'directory') {
        return Object.values(parent.children).find(c => c.name === parts[1]) as VFSFile | undefined;
    }
    return undefined;
  }, [activeFilePath, vfs]);
  
  useEffect(() => {
    if (activeFile && editorRef.current) {
        editorRef.current.innerHTML = activeFile.content;
    }
    if (activeFile && titleRef.current) {
        titleRef.current.value = activeFile.name;
    }
  }, [activeFile]);

  const handleContentChange = () => {
    if (activeFilePath && editorRef.current) {
      onUpdateNodeContent(activeFilePath, editorRef.current.innerHTML);
    }
  };

  const handleTitleChange = (e: React.FocusEvent<HTMLInputElement>) => {
      if (activeFilePath && activeFile && e.target.value !== activeFile.name) {
          const newPath = `/Documents/${e.target.value}`;
          onRenameNode(activeFilePath, e.target.value);
          setActiveFilePath(newPath);
      }
  }

  const createNewNote = () => {
      const name = `Untitled Note ${documents.length + 1}.txt`;
      onCreateNode('/Documents', name, 'file', '<p>New Note</p>');
      setActiveFilePath(`/Documents/${name}`);
  }

  const handleHoustonAction = async (action: HoustonAction) => {
    if (!activeFilePath || !editorRef.current || !API_KEY) return;
    setIsHoustonLoading(true);
    setActiveHoustonAction(action);
    onApiCall?.();

    const currentContent = editorRef.current.innerText;
    let prompt = '';
    switch (action) {
        case 'complete':
            prompt = `You are an AI writing assistant. Complete the following text:\n\n${currentContent}`;
            break;
        case 'summarize':
            prompt = `You are an AI writing assistant. Summarize the following text:\n\n${currentContent}`;
            break;
        case 'fix':
            prompt = `You are an AI writing assistant. Fix any spelling and grammar mistakes in the following text:\n\n${currentContent}`;
            break;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: prompt});
        const newContent = action === 'complete' ? `${editorRef.current.innerHTML}${response.text.replace(/\n/g, '<br>')}` : response.text.replace(/\n/g, '<br>');
        
        if (editorRef.current) {
            editorRef.current.innerHTML = newContent;
        }
        onUpdateNodeContent(activeFilePath, newContent);

    } catch (e) {
        console.error("Houston AI error in Pages:", e);
    } finally {
        setIsHoustonLoading(false);
        setActiveHoustonAction(null);
    }
  };
  
  return (
    <div className="w-full h-full flex bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
      <div className="w-1/3 max-w-xs h-full bg-gray-200/50 dark:bg-gray-900/50 border-r border-gray-300/60 dark:border-gray-700/60 flex flex-col">
          <div className="p-2 border-b border-gray-300/60 dark:border-gray-700/60 flex-shrink-0 flex items-center justify-between">
              <h1 className="font-bold px-2">Documents</h1>
              <button onClick={createNewNote} className="p-1.5 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 text-sm">+</button>
          </div>
          <ul className="flex-grow overflow-y-auto">
              {documents.map(doc => (
                  <li key={doc.id}>
                      <button onClick={() => setActiveFilePath(`/Documents/${doc.name}`)}
                          className={`w-full text-left p-2 border-b border-gray-200 dark:border-gray-700/50 truncate ${activeFilePath === `/Documents/${doc.name}` ? 'bg-blue-200/50 dark:bg-blue-900/50' : 'hover:bg-gray-200/70 dark:hover:bg-gray-800'}`}>
                          {doc.name}
                      </button>
                  </li>
              ))}
          </ul>
      </div>
      <div className="w-2/3 flex-grow flex flex-col">
          {activeFile ? (
              <>
                  <div className="flex-shrink-0 p-2 border-b border-gray-300/60 dark:border-gray-700/60 flex items-center space-x-2">
                      <input ref={titleRef} defaultValue={activeFile.name} onBlur={handleTitleChange} className="font-bold text-lg bg-transparent focus:outline-none flex-grow" />
                      <div className="flex items-center space-x-1">
                          {(['complete', 'summarize', 'fix'] as HoustonAction[]).map(action => (
                            <button key={action} onClick={() => handleHoustonAction(action)} disabled={isHoustonLoading}
                                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50">
                                <HoustonIcon className={`w-5 h-5 ${isHoustonLoading && activeHoustonAction === action ? 'animate-pulse' : ''}`} />
                            </button>
                          ))}
                      </div>
                  </div>
                  <div ref={editorRef} contentEditable={true} onBlur={handleContentChange}
                      className="flex-grow p-4 overflow-y-auto focus:outline-none"
                      suppressContentEditableWarning={true}
                      dangerouslySetInnerHTML={{ __html: activeFile.content }}
                  />
              </>
          ) : (
              <div className="flex-grow flex items-center justify-center text-gray-500">
                  <p>Select a note or create a new one.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default Pages;
