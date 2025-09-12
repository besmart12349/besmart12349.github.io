


import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useSecurity } from '../contexts/SecurityContext';
import { SearchIcon, XIcon, PlusIcon, HoustonIcon } from '../components/Icons';
import type { TabState } from '../types';
import { API_KEY } from '../config';

// Using a <base> tag is an effective way to handle relative paths in the fetched HTML.
const prepareHtml = (htmlString: string, baseUrl: string): string => {
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');
  const existingBase = doc.querySelector('base');
  if (existingBase) {
    existingBase.remove();
  }
  const base = doc.createElement('base');
  base.href = baseUrl;
  doc.head.insertBefore(base, doc.head.firstChild);
  return doc.documentElement.outerHTML;
};

interface MaverickProps {
    initialUrl: string;
    onUrlChange: (url: string) => void;
    onApiCall?: () => void;
    onTitleChange?: (title: string) => void;
}

const BackIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> );
const ForwardIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg> );
const RefreshIcon: React.FC<{isLoading: boolean}> = ({ isLoading }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m7 10v-5h-5M20 12c0-4.418-3.582-8-8-8s-8 3.582-8 8 3.582 8 8 8 8-3.582 8-8z" /></svg> );


const Maverick: React.FC<MaverickProps> = ({ initialUrl, onUrlChange, onApiCall, onTitleChange }) => {
  const createNewTab = (url: string, content: string | null = null, title: string = 'New Tab'): TabState => ({
    id: Date.now(),
    title,
    url: url,
    history: [url],
    historyIndex: 0,
    content,
    isLoading: content === null,
    error: null,
  });

  const [tabs, setTabs] = useState<TabState[]>([createNewTab(initialUrl)]);
  const [activeTabId, setActiveTabId] = useState<number>(tabs[0].id);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const { firewallLevel, scamProtection, proxy } = useSecurity();

  const activeTab = tabs.find(t => t.id === activeTabId);

  const updateTabState = useCallback((tabId: number, updates: Partial<TabState>) => {
    setTabs(prevTabs => prevTabs.map(tab => tab.id === tabId ? { ...tab, ...updates } : tab));
  }, []);

  useEffect(() => {
    if (activeTab) {
      setInputUrl(activeTab.url);
      onTitleChange?.(activeTab.title);
    }
  }, [activeTab, onTitleChange]);

  useEffect(() => {
    if (activeTab && !activeTab.content && !activeTab.error) {
        navigate(activeTab.url, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabId]);

  
  const navigate = async (urlToLoad: string, isHistoryNavigation = false) => {
    if (!activeTab) return;

    let finalUrl = urlToLoad.trim();
    // Check if it's a search query or a URL
    const isUrl = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(finalUrl) || finalUrl.startsWith("about:") || finalUrl.startsWith("data:");
    
    if (!isUrl) {
      finalUrl = `https://www.google.com/search?q=${encodeURIComponent(finalUrl)}`;
    } else if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith("about:") && !finalUrl.startsWith("data:")) {
      finalUrl = 'https://' + finalUrl;
    }
    
    updateTabState(activeTab.id, { isLoading: true, error: null, url: finalUrl });
    setInputUrl(finalUrl);
    
    if (!isHistoryNavigation) {
      const newHistory = activeTab.history.slice(0, activeTab.historyIndex + 1);
      newHistory.push(finalUrl);
      updateTabState(activeTab.id, { history: newHistory, historyIndex: newHistory.length - 1 });
    }
    onUrlChange(finalUrl);

    // Firewall check
    const isBlockedByFirewall = () => {
        if (firewallLevel === 'Maximum' && !['wikipedia.org', 'google.com'].some(domain => finalUrl.includes(domain))) return true;
        if (firewallLevel === 'High' && ['facebook.com', 'tiktok.com', 'twitter.com', 'instagram.com'].some(domain => finalUrl.includes(domain))) return true;
        return false;
    }

    if(isBlockedByFirewall()) {
        const error = `Request to ${finalUrl} blocked by DefenseIOS Firewall (Level: ${firewallLevel}).`
        updateTabState(activeTab.id, { error, content: null, isLoading: false, title: "Blocked" });
        return;
    }

    // Scam Protection check
    const knownScamSites = ['totally-a-scam.com', 'free-money-4u.net', 'win-a-prize.io'];
    if (scamProtection && knownScamSites.some(site => finalUrl.includes(site))) {
         const error = `Warning: This website is flagged as a potential scam and has been blocked by DefenseIOS Web Protection.`
         updateTabState(activeTab.id, { error, content: null, isLoading: false, title: "Blocked" });
         return;
    }

    try {
      const proxyUrl = `${proxy.url}${encodeURIComponent(finalUrl)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) throw new Error(`Proxy error: ${response.status} ${response.statusText}`);

      const html = await response.text();
      const preparedHtml = prepareHtml(html, finalUrl);
      const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : finalUrl;

      updateTabState(activeTab.id, { content: preparedHtml, isLoading: false, title });
    } catch (e: any) {
        console.error("Primary fetch failed, initiating X-Factor Bypass:", e);
        onApiCall?.();

        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            const prompt = `You are X-Factor Bypass, an AI that reconstructs web pages when direct access fails. Your task is to generate a complete, single HTML file based on the likely content of the URL "${finalUrl}".
- Structure the page logically with semantic HTML (<header>, <nav>, <main>, <article>, <footer>, etc.).
- The content should be a plausible representation of what would be on that page. Focus on text, headings, links, and layout.
- Style the page directly in a <style> tag in the <head>. Use a clean, modern, dark theme (e.g., body { background-color: #1a1a1a; color: #f0f0f0; font-family: sans-serif; }).
- If you cannot access the URL or determine its content, return an HTML page stating that the content could not be reconstructed.
- IMPORTANT: Do not include any of your own commentary, warnings, or explanations. The output must be ONLY the HTML code, starting with <!DOCTYPE html>.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            const preparedHtml = prepareHtml(response.text, finalUrl);
            updateTabState(activeTab.id, { content: preparedHtml, isLoading: false, title: `AI View: ${finalUrl}` });
        } catch (aiError: any) {
            console.error("X-Factor Bypass failed:", aiError);
            const error = `X-Factor Bypass failed. Could not reconstruct page. Error: ${aiError.message}`;
            updateTabState(activeTab.id, { error, content: null, isLoading: false, title: "Error" });
        }
    }
  };
  
  const handleBack = () => {
    if (activeTab && activeTab.historyIndex > 0) {
      const newIndex = activeTab.historyIndex - 1;
      updateTabState(activeTab.id, { historyIndex: newIndex });
      navigate(activeTab.history[newIndex], true);
    }
  };

  const handleForward = () => {
    if (activeTab && activeTab.historyIndex < activeTab.history.length - 1) {
      const newIndex = activeTab.historyIndex + 1;
      updateTabState(activeTab.id, { historyIndex: newIndex });
      navigate(activeTab.history[newIndex], true);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(inputUrl);
    }
  };

  const refresh = () => {
    if(activeTab) navigate(activeTab.url, true);
  };
  
  const addTab = (url: string = 'https://www.wikipedia.org/', content: string | null = null, title: string = "New Tab") => {
    const newTab = createNewTab(url, content, title);
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: number) => {
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    if (tabs.length === 1) return; // Don't close the last tab

    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId) {
      const newActiveIndex = Math.max(0, tabIndex - 1);
      setActiveTabId(newTabs[newActiveIndex].id);
    }
  };

  const summarizePage = async () => {
    if (!activeTab?.content) return;
    onApiCall?.();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = activeTab.content;
    const pageText = tempDiv.innerText.trim().substring(0, 15000); // Limit context size

    if (pageText.length < 100) {
        alert("Not enough text on the page to summarize.");
        return;
    }

    const tempTabTitle = `Summarizing: ${activeTab.title}`;
    const tempTabContent = `<body style="background-color: #1a1a1a; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh;"><p>AI is summarizing the page...</p></body>`;
    addTab('about:blank', tempTabContent, tempTabTitle);

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const prompt = `Summarize the following web page content into a few key bullet points and a concluding paragraph. Format the output in clean HTML with a dark theme.\n\nCONTENT:\n${pageText}`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });

        const summaryHtml = `<body style="background-color: #1a1a1a; color: white; font-family: sans-serif; padding: 2rem;"><h2>AI Summary of: ${activeTab.title}</h2>${response.text}</body>`;

        const currentTabs = [...tabs];
        const newTab = createNewTab('about:summary', summaryHtml, `Summary: ${activeTab.title}`);
        setTabs([...currentTabs, newTab]);
        setActiveTabId(newTab.id);
        
    } catch(e) {
        console.error("Summarization failed:", e);
        const errorHtml = `<body style="background-color: #1a1a1a; color: red; font-family: sans-serif; padding: 2rem;"><h2>Summarization Failed</h2><p>Could not generate a summary for this page.</p></body>`;
        const currentTabs = [...tabs];
        const newTab = createNewTab('about:error', errorHtml, 'Error');
        setTabs([...currentTabs, newTab]);
        setActiveTabId(newTab.id);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Tab Bar */}
      <div className="flex-shrink-0 flex items-center bg-gray-200/50 dark:bg-gray-800/50 border-b border-gray-300/50 dark:border-gray-700/50 pl-20 pr-2">
        <div className="flex-grow flex items-end -mb-px">
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`flex items-center justify-between px-3 py-2 border-r border-gray-300/50 dark:border-gray-700/50 cursor-pointer max-w-48 ${tab.id === activeTabId ? 'bg-gray-100 dark:bg-gray-800 rounded-t-md' : 'bg-gray-200/70 dark:bg-gray-900/70'}`}
          >
            <span className="text-sm truncate text-gray-800 dark:text-gray-200">{tab.title}</span>
            <button onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }} className="ml-2 p-0.5 rounded-full hover:bg-gray-400/50 dark:hover:bg-gray-600/50">
              <XIcon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        ))}
        </div>
        <button onClick={() => addTab()} className="ml-2 p-1.5 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700">
            <PlusIcon className="w-4 h-4 text-gray-700 dark:text-gray-200"/>
        </button>
      </div>

      <div className="flex-shrink-0 flex items-center p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 space-x-2">
        <button onClick={handleBack} disabled={!activeTab || activeTab.historyIndex === 0} className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed">
          <BackIcon />
        </button>
        <button onClick={handleForward} disabled={!activeTab || activeTab.historyIndex >= activeTab.history.length - 1} className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed">
          <ForwardIcon />
        </button>
        <button onClick={refresh} className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
          <RefreshIcon isLoading={!!activeTab?.isLoading} />
        </button>
        <button onClick={summarizePage} className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" title="AI Summarize Page">
          <HoustonIcon className="w-5 h-5" />
        </button>

        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="w-full h-full border-0 relative bg-white dark:bg-gray-900">
        {(activeTab?.isLoading || activeTab?.error) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200">
                {activeTab.isLoading && (
                    <>
                        <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 dark:border-gray-600 rounded-full animate-spin"></div>
                        <p className="mt-2 text-center px-4">{`Loading ${activeTab.url}...`}</p>
                    </>
                )}
                {activeTab.error && !activeTab.isLoading && (
                    <div className="text-center p-4">
                        <h3 className="font-bold text-red-600 dark:text-red-500">Page Failed to Load</h3>
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">{activeTab.error}</p>
                    </div>
                )}
            </div>
        )}
        {tabs.map(tab => (
            <iframe
                key={tab.id}
                srcDoc={tab.content || ''}
                className={`w-full h-full border-0 transition-opacity duration-300 ${activeTab?.id !== tab.id ? 'hidden' : ''} ${tab.isLoading || tab.error ? 'opacity-0' : 'opacity-100'}`}
                title="Maverick Browser"
                sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            />
        ))}
      </div>
    </div>
  );
};

export default Maverick;