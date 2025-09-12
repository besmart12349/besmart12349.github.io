
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { API_KEY } from '../config';
import type { StockData } from '../types';
import { PlusIcon, XIcon } from '../components/Icons';

interface StocksProps {
    watchedStocks: string[];
    onWatchlistChange: (stocks: string[]) => void;
    onApiCall?: () => void;
}

const Stocks: React.FC<StocksProps> = ({ watchedStocks, onWatchlistChange, onApiCall }) => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchAllStockData = async () => {
        if (!watchedStocks || watchedStocks.length === 0) {
            setStockData([]);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        onApiCall?.();
        
        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Get the current stock price data for the following tickers: ${watchedStocks.join(', ')}.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                ticker: { type: Type.STRING },
                                name: { type: Type.STRING },
                                price: { type: Type.NUMBER },
                                change: { type: Type.NUMBER },
                                changePercent: { type: Type.NUMBER },
                            }
                        }
                    }
                }
            });
            const data: StockData[] = JSON.parse(response.text);
            // Ensure the order matches watchedStocks
            const sortedData = watchedStocks.map(ticker => data.find(d => d.ticker.toUpperCase() === ticker.toUpperCase())).filter(Boolean) as StockData[];
            setStockData(sortedData);
        } catch (error) {
            console.error("Failed to fetch stock data:", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchAllStockData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedStocks]);

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    const tickerToAdd = searchTerm.toUpperCase();
    if (!tickerToAdd || watchedStocks.includes(tickerToAdd)) {
        setSearchTerm('');
        return;
    }
    setIsAdding(true);
    // Optimistically add to list, can be reverted on error
    onWatchlistChange([...watchedStocks, tickerToAdd]);
    setSearchTerm('');
    setIsAdding(false);
  };
  
  const handleRemoveStock = (tickerToRemove: string) => {
    onWatchlistChange(watchedStocks.filter(t => t !== tickerToRemove));
  }

  return (
    <div className="w-full h-full bg-gray-900 text-white p-4 font-sans flex flex-col">
      <h1 className="text-2xl font-bold mb-2 border-b border-gray-700 pb-2">My Watchlist</h1>
      
      <form onSubmit={handleAddStock} className="flex space-x-2 mb-4">
        <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Add Ticker (e.g. NVDA)"
            className="flex-grow bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" disabled={isAdding} className="p-2 bg-blue-600 rounded-md hover:bg-blue-500 disabled:bg-gray-600">
            <PlusIcon className="w-5 h-5"/>
        </button>
      </form>
      
      {isLoading ? (
         <div className="flex-grow flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-600 rounded-full animate-spin"></div>
         </div>
      ) : (
        <ul className="flex-grow overflow-y-auto">
            {stockData.map(stock => {
            const isPositive = stock.change >= 0;
            return (
                <li key={stock.ticker} className="group flex justify-between items-center py-3 border-b border-gray-800 last:border-b-0">
                <button onClick={() => handleRemoveStock(stock.ticker)} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <XIcon className="w-4 h-4 text-red-500"/>
                </button>
                <div className="flex-grow">
                    <p className="font-bold text-lg">{stock.ticker}</p>
                    <p className="text-sm text-gray-400 truncate">{stock.name}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-lg">${stock.price.toFixed(2)}</p>
                    <span className={`px-2 py-1 rounded-md text-sm ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </span>
                </div>
                </li>
            );
            })}
        </ul>
      )}
    </div>
  );
};

export default Stocks;