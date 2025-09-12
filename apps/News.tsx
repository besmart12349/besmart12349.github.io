import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { API_KEY } from '../config';
import type { NewsArticle, Notification } from '../types';
import { NewsIcon } from '../components/Icons';

interface NewsProps {
    onApiCall?: () => void;
    addNotification?: (notification: Omit<Notification, 'id' | 'icon'>) => void;
}

const News: React.FC<NewsProps> = ({ onApiCall, addNotification }) => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
    const [articleContent, setArticleContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isReading, setIsReading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchNews = useCallback(async (query: string = "latest top world news headlines") => {
        setIsLoading(true);
        setSelectedArticle(null);
        setArticleContent('');
        onApiCall?.();

        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Provide a list of 5 recent news articles about ${query}.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                source: { type: Type.STRING },
                                summary: { type: Type.STRING },
                            }
                        }
                    }
                }
            });
            const newsData: NewsArticle[] = JSON.parse(response.text);
            setArticles(newsData);
        } catch (e) {
            console.error("News fetch error:", e);
            setArticles([]);
        } finally {
            setIsLoading(false);
        }
    }, [onApiCall]);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            fetchNews(searchTerm);
        }
    };
    
    const viewArticle = async (article: NewsArticle) => {
        setSelectedArticle(article);
        setIsReading(true);
        onApiCall?.();
        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Based on the headline "${article.title}" from ${article.source}, write a detailed news article. Provide a comprehensive overview of the topic. Structure it like a real news report with paragraphs.`,
            });
            setArticleContent(response.text.replace(/\n/g, '<br/><br/>'));
        } catch(e) {
            console.error("Article generation error:", e);
            setArticleContent("<p>Could not load the full article.</p>");
        } finally {
            setIsReading(false);
        }
    }


    return (
        <div className="w-full h-full flex bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {/* Sidebar */}
            <div className="w-1/3 max-w-sm h-full bg-gray-200/50 dark:bg-gray-900/50 border-r border-gray-300/60 dark:border-gray-700/60 flex flex-col">
                <div className="p-3 border-b border-gray-300/60 dark:border-gray-700/60 flex-shrink-0">
                    <form onSubmit={handleSearch}>
                        <input 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search news..."
                            className="w-full p-2 bg-white dark:bg-gray-800 border rounded-md dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </form>
                </div>
                {isLoading ? (
                     <div className="flex-grow flex items-center justify-center">
                        <div className="w-6 h-6 border-4 border-t-blue-500 border-gray-300 dark:border-gray-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                     <ul className="flex-grow overflow-y-auto">
                        {articles.map((article, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => viewArticle(article)}
                                    className={`w-full text-left p-3 border-b border-gray-200 dark:border-gray-700/50 ${selectedArticle?.title === article.title ? 'bg-blue-200/50 dark:bg-blue-900/50' : 'hover:bg-gray-200/70 dark:hover:bg-gray-800'}`}
                                >
                                    <h3 className="font-semibold text-sm">{article.title}</h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{article.source}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Main Content */}
            <div className="w-2/3 h-full flex flex-col overflow-y-auto p-6">
                {selectedArticle ? (
                    <>
                        <button onClick={() => setSelectedArticle(null)} className="text-blue-500 hover:underline text-sm mb-2 self-start">&larr; Back to headlines</button>
                        <h1 className="text-2xl font-bold mb-1">{selectedArticle.title}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Source: {selectedArticle.source}</p>
                        <p className="text-base italic border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 mb-6 bg-gray-50 dark:bg-gray-900/30">{selectedArticle.summary}</p>
                        {isReading ? (
                             <div className="flex-grow flex items-center justify-center">
                                <div className="w-6 h-6 border-4 border-t-blue-500 border-gray-300 dark:border-gray-600 rounded-full animate-spin"></div>
                             </div>
                        ) : (
                            <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: articleContent }} />
                        )}
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
                        <NewsIcon className="w-24 h-24 mb-4" />
                        <h2 className="text-lg font-semibold">Helios News</h2>
                        <p>Select an article to read or search for a topic.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default News;