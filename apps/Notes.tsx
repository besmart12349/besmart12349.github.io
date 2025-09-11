import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Page } from '../types';
import { HoustonIcon } from '../components/Icons';
import { API_KEY } from '../config';

interface PagesProps {
  savedPages: Page[];
  onSavePages: (pages: Page[]) => void;
  onApiCall?: () => void;
}

type HoustonAction = 'complete' | 'summarize' | 'fix';

const Pages: React.FC<PagesProps> = ({ savedPages, onSavePages, onApiCall }) => {
  const [pages, setPages] = useState<Page[]>(savedPages);
  const [activePageId, setActivePageId] = useState<number | null>(pages[0]?.id || null);
  const [isHoustonLoading, setIsHoustonLoading] = useState(false);
  const [activeHoustonAction, setActiveHoustonAction] = useState<HoustonAction | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const activePage = pages.find(p => p.id === activePageId);

  useEffect(() => {
    setPages(savedPages);
    if (!activePageId && savedPages.length > 0) {
      setActivePageId(savedPages[0].id);
    }
  }, [savedPages, activePageId]);

  useEffect(() => {
    if (activePage && editorRef.current) {
      editorRef.current.innerHTML = activePage.content;
    }
     if (activePage && titleRef.current) {
      titleRef.current.value = activePage.title;
    }
  }, [activePage]);

  const handleSave = () => {
    if (!activePage) return;

    const updatedPages = pages.map(page =>
      page.id === activePage.id
        ? {
            ...page,
            title: titleRef.current?.value || 'Untitled Page',
            content: editorRef.current?.innerHTML || '',
          }
        : page
    );
    setPages(updatedPages);
    onSavePages(updatedPages);
  };

  const handleNewPage = () => {
    const newPage: Page = {
      id: Date.now(),
      title: 'Untitled Page',
      content: '',
    };
    const updatedPages = [...pages, newPage];
    setPages(updatedPages);
    setActivePageId(newPage.id);
    onSavePages(updatedPages);
  };
  
  const handleDeletePage = (idToDelete: number) => {
    const updatedPages = pages.filter(page => page.id !== idToDelete);
    setPages(updatedPages);
    onSavePages(updatedPages);
    if(activePageId === idToDelete) {
        setActivePageId(updatedPages[0]?.id || null);
    }
  }

  const handleHoustonAction = async (action: HoustonAction) => {
    if (!editorRef.current || isHoustonLoading) return;
    const currentText = editorRef.current.innerText;
    if (currentText.trim().length < 10 && action !== 'complete') {
        alert("You need more text to use this feature.");
        return;
    }

    setIsHoustonLoading(true);
    setActiveHoustonAction(action);
    onApiCall?.();

    let prompt = '';
    switch(action) {
        case 'complete':
            prompt = `Continue writing the following text:\n\n${currentText}`;
            break;
        case 'summarize':
            prompt = `Summarize the following text in a concise paragraph:\n\n${currentText}`;
            break;
        case 'fix':
            prompt = `Fix any spelling and grammar mistakes in the following text. Only return the corrected text, without any commentary.\n\n${currentText}`;
            break;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        const newText = response.text;

        if (editorRef.current) {
            if (action === 'complete') {
                 editorRef.current.innerHTML += ` ${newText.replace(/\n/g, '<br/>')}`;
            } else {
                 editorRef.current.innerHTML = newText.replace(/\n/g, '<br/>');
            }
            handleSave();
        }
    } catch (e) {
        console.error("Houston AI Error in Pages:", e);
        alert("An error occurred while using the AI assistant.");
    } finally {
        setIsHoustonLoading(false);
        setActiveHoustonAction(null);
    }
  };

  const HoustonToolbar: React.FC = () => (
    <div className="p-2 border-b border-gray-300/60 dark:border-gray-700/60 flex items-center space-x-2 bg-gray-50 dark:bg-gray-800">
        <HoustonIcon className="w-5 h-5 text-indigo-500" />
        <span className="text-sm font-semibold mr-2 dark:text-gray-300">Houston AI:</span>
        {([ 'complete', 'summarize', 'fix' ] as HoustonAction[]).map(action => (
             <button 
                key={action}
                onClick={() => handleHoustonAction(action)} 
                disabled={isHoustonLoading}
                className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50">
                    {isHoustonLoading && activeHoustonAction === action ? 'Working...' : action.charAt(0).toUpperCase() + action.slice(1)}
            </button>
        ))}
    </div>
  );

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 flex">
      {/* Sidebar */}
      <div className="w-1/3 h-full bg-gray-100/80 dark:bg-gray-900/80 border-r border-gray-300/60 dark:border-gray-700/60 flex flex-col">
        <div className="p-2 border-b border-gray-300/60 dark:border-gray-700/60 flex-shrink-0">
          <button onClick={handleNewPage} className="w-full px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
            New Page
          </button>
        </div>
        <ul className="flex-grow overflow-y-auto">
          {pages.map(page => (
            <li key={page.id}>
              <button
                onClick={() => setActivePageId(page.id)}
                className={`w-full text-left p-3 border-b border-gray-200 dark:border-gray-700/50 ${activePageId === page.id ? 'bg-blue-200/50 dark:bg-blue-900/50' : 'hover:bg-gray-200/70 dark:hover:bg-gray-800'}`}
              >
                <h4 className="font-semibold text-sm truncate dark:text-gray-200">{page.title}</h4>
                <p className="text-xs text-gray-500 truncate" dangerouslySetInnerHTML={{ __html: page.content.replace(/<[^>]*>?/gm, ' ') || 'No content' }} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main editor */}
      <div className="w-2/3 h-full flex flex-col">
        {activePage ? (
          <>
            <div className="flex-shrink-0 p-2 border-b border-gray-300/60 dark:border-gray-700/60 flex justify-between items-center">
              <input
                ref={titleRef}
                defaultValue={activePage.title}
                onBlur={handleSave}
                className="font-bold bg-transparent focus:outline-none w-full dark:text-white"
              />
               <button onClick={handleSave} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded hover:bg-gray-300 mr-2">Save</button>
               <button onClick={() => handleDeletePage(activePage.id)} className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">Delete</button>
            </div>
            <HoustonToolbar />
            <div
              ref={editorRef}
              contentEditable="true"
              onBlur={handleSave}
              className="flex-grow w-full p-6 text-gray-800 focus:outline-none resize-none font-serif text-base leading-7 dark:text-gray-200"
            />
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            <p>Select a page or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pages;