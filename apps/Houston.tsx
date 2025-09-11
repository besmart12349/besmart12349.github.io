import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Notification, HoustonMessage } from '../types';
import { API_KEY } from '../config';

interface HoustonProps {
  history: HoustonMessage[];
  onHistoryChange: (history: HoustonMessage[]) => void;
  onApiCall?: () => void;
  addNotification?: (notification: Omit<Notification, 'id' | 'icon'>) => void;
}

const Houston: React.FC<HoustonProps> = ({ history, onHistoryChange, onApiCall, addNotification }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history]);

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const geminiHistory = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    chatRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: geminiHistory,
      config: {
        systemInstruction: "You are Houston, a friendly and helpful AI assistant integrated into ArsisOS. Your responses should be concise, informative, and slightly futuristic in tone. Always be helpful and polite.",
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading || !chatRef.current) return;

    const userMessage: HoustonMessage = { sender: 'user', text: input };
    const newHistory = [...history, userMessage];
    onHistoryChange(newHistory);
    
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      onApiCall?.();
      const response: GenerateContentResponse = await chatRef.current.sendMessage({ message: currentInput });
      
      const houstonResponse: HoustonMessage = { sender: 'houston', text: response.text };
      onHistoryChange([...newHistory, houstonResponse]);
      
      addNotification?.({
        appId: 'houston',
        title: 'Houston has a response',
        message: 'Your new message is ready.',
      });
    } catch (error) {
      console.error("Houston AI Error:", error);
      const errorMessage: HoustonMessage = { sender: 'houston', text: "Sorry, I'm having trouble connecting to my network right now." };
      onHistoryChange([...newHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="w-full h-full bg-gray-800 flex flex-col text-white">
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {history.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'houston' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0"></div>}
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0"></div>
            <div className="max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl bg-gray-700 rounded-bl-none">
                <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                </div>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>
      <div className="p-4 border-t border-gray-700 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask Houston anything..."
          className="flex-grow bg-gray-700 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading} className="ml-3 p-2 rounded-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Houston;