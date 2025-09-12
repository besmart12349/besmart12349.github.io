import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import type { HoustonMessage, UserProfileData, VFSFile } from '../types';
import { API_KEY } from '../config';
import { HoustonIcon, SparklesIcon, PaperclipIcon, MicrophoneIcon, StopIcon } from '../components/Icons';

interface HoustonProps {
  history: HoustonMessage[];
  onHistoryChange: (history: HoustonMessage[]) => void;
  onApiCall?: () => void;
  currentUser: string | null;
  houstonModel: '1.0' | '1.5' | '2.0-pro';
  onModelChange: (model: '1.0' | '1.5' | '2.0-pro') => void;
  vfs?: any; // Add VFS to props
}

const Houston: React.FC<HoustonProps> = (props) => {
  const { history, onHistoryChange, onApiCall, currentUser, houstonModel, onModelChange } = props;
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history]);

  const getSystemInstruction = useCallback((model: string) => {
    switch(model) {
        case '1.5':
            return "You are Houston 1.5 (Comprehensive), a helpful research assistant integrated into ArsisOS. Provide detailed, well-structured, and informative answers. Use markdown for formatting when appropriate.";
        case '2.0-pro':
            return "You are Houston 2.0 PRO (Genius), an expert-level AI assistant in ArsisOS. You excel at coding, complex problem-solving, and logical reasoning. Provide clear, accurate, and professional-grade responses. Format code snippets correctly using markdown.";
        case '1.0':
        default:
            return "You are Houston 1.0 (Base), a friendly and helpful AI assistant integrated into ArsisOS. Your responses should be concise, informative, and slightly futuristic in tone. Always be helpful and polite.";
    }
  }, []);

  useEffect(() => {
    if (!API_KEY) return;
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const geminiHistory = history.slice(1).map(msg => ({ // Exclude initial greeting
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    chatRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: geminiHistory,
      config: {
        systemInstruction: getSystemInstruction(houstonModel),
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [houstonModel, getSystemInstruction]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading || !chatRef.current) return;

    const userMessage: HoustonMessage = { sender: 'user', text: input };
    
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    const newHistory = [...history, userMessage];
    let streamedText = '';
    
    // Add a placeholder for Houston's response
    const houstonPlaceholder: HoustonMessage = { sender: 'houston', text: '' };
    let currentHistoryForStream = [...newHistory, houstonPlaceholder];
    onHistoryChange(currentHistoryForStream);

    try {
      onApiCall?.();
      const response = await chatRef.current.sendMessageStream({ message: currentInput });
      
      for await (const chunk of response) {
        streamedText += chunk.text;
        // Update the last message in the history (the placeholder)
        // FIX: Pass the updated array directly instead of a function to match the prop type.
        // A local variable `currentHistoryForStream` is used to keep track of the history
        // state during the streaming process to avoid issues with stale closures.
        const updated = [...currentHistoryForStream];
        updated[updated.length - 1] = { sender: 'houston', text: streamedText };
        currentHistoryForStream = updated;
        onHistoryChange(currentHistoryForStream);
      }

    } catch (error) {
      console.error("Houston AI Error:", error);
      const errorMessage: HoustonMessage = { sender: 'houston', text: "Sorry, I'm having trouble connecting to my network right now." };
       // FIX: Pass the updated array directly. Use the local `currentHistoryForStream` variable
       // to ensure the correct history state is being modified.
       const updated = [...currentHistoryForStream];
       updated[updated.length - 1] = errorMessage;
       onHistoryChange(updated);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
      onHistoryChange([{ sender: 'houston', text: "Hello! I'm Houston, your AI assistant. How can I help you today?" }]);
  }

  const ModelCard: React.FC<{
    title: string;
    description: string;
    modelId: '1.0' | '1.5' | '2.0-pro';
    disabled?: boolean;
  }> = ({ title, description, modelId, disabled }) => (
    <button 
      onClick={() => !disabled && onModelChange(modelId)}
      disabled={disabled}
      className={`p-4 text-left bg-gray-700/50 rounded-lg border border-gray-600/50 hover:bg-gray-700/80 transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed ${houstonModel === modelId ? 'ring-2 ring-blue-500' : ''}`}
    >
        <h3 className="font-bold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
        {disabled && <p className="text-xs text-yellow-400 mt-1">Requires Arsis ID login</p>}
    </button>
  );

  return (
    <div className="w-full h-full bg-gray-900 flex flex-col text-white font-sans">
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {history.length <= 1 ? (
              <div className="text-center pt-8">
                  <HoustonIcon className="w-24 h-24 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-gray-200">Welcome to Houston</h1>
                  <p className="text-gray-400 mb-8">Choose a model to start a conversation.</p>
                  <div className="space-y-3 max-w-lg mx-auto">
                      <ModelCard title="Houston 1.0 (Base)" description="Your friendly chat and help bot for quick answers." modelId="1.0" />
                      <ModelCard title="Houston 1.5 (Comprehensive)" description="Advanced research and data smarts for in-depth topics." modelId="1.5" />
                      <ModelCard title="Houston 2.0 PRO (Genius)" description="The ultimate coding and genius model for complex tasks." modelId="2.0-pro" />
                  </div>
              </div>
          ) : (
             <div className="space-y-6">
                {history.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'houston' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center"><SparklesIcon className="w-5 h-5 text-white"/></div>}
                        <div className={`max-w-xl p-3.5 rounded-2xl whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-gray-800'}`}>
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && history.length > 1 && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center"><SparklesIcon className="w-5 h-5 text-white"/></div>
                        <div className="max-w-xl p-3 rounded-2xl bg-gray-800">
                             <span className="w-2 h-2 bg-white rounded-full inline-block animate-pulse [animation-delay:-0.3s]"></span>
                             <span className="w-2 h-2 bg-white rounded-full inline-block animate-pulse [animation-delay:-0.15s] ml-1"></span>
                             <span className="w-2 h-2 bg-white rounded-full inline-block animate-pulse ml-1"></span>
                        </div>
                    </div>
                )}
                <div ref={endOfMessagesRef} />
             </div>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 p-4 border-t border-gray-700/50">
          <div className="max-w-3xl mx-auto">
             <div className="relative">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={`Message Houston ${houstonModel}...`}
                    className="w-full bg-gray-800 rounded-lg py-3 pl-4 pr-28 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    rows={1}
                    disabled={isLoading}
                />
                 <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                    <button className="p-2 rounded-full hover:bg-gray-700"><PaperclipIcon className="w-5 h-5 text-gray-400"/></button>
                    <button className="p-2 rounded-full hover:bg-gray-700"><MicrophoneIcon className="w-5 h-5 text-gray-400"/></button>
                    <button onClick={handleSend} disabled={isLoading || !input} className="ml-1 p-2 rounded-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                 </div>
             </div>
             <div className="text-center mt-2">
                 <button onClick={handleNewChat} className="text-xs text-gray-500 hover:underline">New Chat</button>
             </div>
          </div>
      </div>
    </div>
  );
};

export default Houston;