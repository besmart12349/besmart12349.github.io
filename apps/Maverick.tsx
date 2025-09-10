

import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useSecurity } from '../contexts/SecurityContext';
import { SearchIcon } from '../components/Icons';

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
}

const BackIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> );
const ForwardIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg> );
const RefreshIcon: React.FC<{isLoading: boolean}> = ({ isLoading }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m7 10v-5h-5M20 12c0-4.418-3.582-8-8-8s-8 3.582-8 8 3.582 8 8 8 8-3.582 8-8z" /></svg> );


const Maverick: React.FC<MaverickProps> = ({ initialUrl, onUrlChange, onApiCall }) => {
  const [history, setHistory] = useState<string[]>([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const [inputUrl, setInputUrl] = useState(history[historyIndex]);
  const [iframeContent, setIframeContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bypassStatus, setBypassStatus] = useState<string | null>(null);
  const { firewallLevel, scamProtection, proxy } = useSecurity();

  const navigate = async (urlToLoad: string, isHistoryNavigation = false) => {
    let finalUrl = urlToLoad;
    if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith('about:blank')) {
      finalUrl = 'https://' + finalUrl;
    }
    
    setIsLoading(true);
    setError(null);
    setBypassStatus(null);
    setInputUrl(finalUrl);
    
    if (!isHistoryNavigation) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(finalUrl);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      onUrlChange(finalUrl);
    } else {
      onUrlChange(finalUrl);
    }

    // Firewall check
    const isBlockedByFirewall = () => {
        if (firewallLevel === 'Maximum' && !['wikipedia.org', 'google.com'].some(domain => finalUrl.includes(domain))) return true;
        if (firewallLevel === 'High' && ['facebook.com', 'tiktok.com', 'twitter.com', 'instagram.com'].some(domain => finalUrl.includes(domain))) return true;
        return false;
    }

    if(isBlockedByFirewall()) {
        setError(`Request to ${finalUrl} blocked by DefenseIOS Firewall (Level: ${firewallLevel}).`);
        setIframeContent(null);
        setIsLoading(false);
        return;
    }

    // Scam Protection check
    const knownScamSites = ['totally-a-scam.com', 'free-money-4u.net', 'win-a-prize.io'];
    if (scamProtection && knownScamSites.some(site => finalUrl.includes(site))) {
         setError(`Warning: This website is flagged as a potential scam and has been blocked by DefenseIOS Web Protection.`);
         setIframeContent(null);
         setIsLoading(false);
         return;
    }

    try {
      const proxyUrl = `${proxy.url}${encodeURIComponent(finalUrl)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) throw new Error(`Proxy error: ${response.status} ${response.statusText}`);

      const html = await response.text();
      const preparedHtml = prepareHtml(html, finalUrl);
      setIframeContent(preparedHtml);
      setIsLoading(false);
    } catch (e: any) {
        console.error("Primary fetch failed, initiating X-Factor Bypass:", e);
        setError(null);
        setBypassStatus('Primary proxy blocked. Engaging X-Factor AI to reconstruct page...');
        onApiCall?.();

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `You are X-Factor Bypass, an AI that reconstructs web pages when direct access fails. Analyze the content from the URL "${finalUrl}" and generate a simplified but functional HTML representation of the page. Focus on the main text, headings, links, and general layout. If you cannot access the URL, state that. Do not include any of your own commentary, only return the HTML code. Style the page to be readable with a dark theme background (#1a1a1a) and light text.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            const preparedHtml = prepareHtml(response.text, finalUrl);
            setIframeContent(preparedHtml);
            setBypassStatus(null);
        } catch (aiError: any) {
            console.error("X-Factor Bypass failed:", aiError);
            setError(`X-Factor Bypass failed. Could not reconstruct page. Error: ${aiError.message}`);
            setIframeContent(null);
            setBypassStatus(null);
        } finally {
            setIsLoading(false);
        }
    }
  };
  
  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      navigate(history[newIndex], true);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      navigate(history[newIndex], true);
    }
  };
  
  useEffect(() => {
    navigate(history[historyIndex], true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(inputUrl);
    }
  };

  const refresh = () => {
    navigate(history[historyIndex], true);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 dark:bg-gray-900">
      <div className="flex-shrink-0 flex items-center p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 space-x-2">
        <button onClick={handleBack} disabled={historyIndex === 0} className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed">
          <BackIcon />
        </button>
        <button onClick={handleForward} disabled={historyIndex >= history.length - 1} className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed">
          <ForwardIcon />
        </button>
        <button onClick={refresh} className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
          <RefreshIcon isLoading={isLoading} />
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
        {(isLoading || error) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200">
                {isLoading && (
                    <>
                        <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 dark:border-gray-600 rounded-full animate-spin"></div>
                        <p className="mt-2 text-center px-4">{bypassStatus || `Loading ${history[historyIndex]}...`}</p>
                    </>
                )}
                {error && !isLoading && (
                    <div className="text-center p-4">
                        <h3 className="font-bold text-red-600 dark:text-red-500">Page Failed to Load</h3>
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>
                    </div>
                )}
            </div>
        )}
        {iframeContent && (
            <iframe
                srcDoc={iframeContent}
                className={`w-full h-full border-0 transition-opacity duration-300 ${isLoading || error ? 'opacity-0' : 'opacity-100'}`}
                title="Maverick Browser"
                sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            />
        )}
      </div>
    </div>
  );
};

export default Maverick;