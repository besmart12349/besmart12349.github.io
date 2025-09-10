import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Notification } from '../types';

type Mode = 'image' | 'video';

interface ImaginariumProps {
  onApiCall?: () => void;
  addNotification?: (notification: Omit<Notification, 'id' | 'icon'>) => void;
}

const Imaginarium: React.FC<ImaginariumProps> = ({ onApiCall, addNotification }) => {
  const [mode, setMode] = useState<Mode>('image');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError(null);
    
    onApiCall?.();

    try {
      if (mode === 'image') {
        const response = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: prompt,
          config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
        });
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        setResult(`data:image/jpeg;base64,${base64ImageBytes}`);
      } else {
        let operation = await ai.models.generateVideos({
          model: 'veo-2.0-generate-001',
          prompt: prompt,
        });

        while (!operation.done) {
          await new Promise(resolve => setTimeout(resolve, 10000));
          operation = await ai.operations.getVideosOperation({ operation: operation });
        }
        
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (downloadLink) {
          setResult(downloadLink);
        } else {
          setError('Video generation failed. Please try again.');
        }
      }
      addNotification?.({
        appId: 'imaginarium',
        title: 'Generation Complete!',
        message: `Your ${mode} for "${prompt.substring(0, 20)}..." is ready.`,
      });
    } catch (e) {
      console.error(e);
      setError('An error occurred during generation. Please check your prompt or try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = async () => {
    if (!result) return;
    
    const fileName = `${prompt.slice(0, 20).replace(/\s/g, '_')}.${mode === 'image' ? 'jpg' : 'mp4'}`;
    let blobUrl = result;

    if (mode === 'video') {
      const response = await fetch(`${result}&key=${process.env.API_KEY}`);
      const blob = await response.blob();
      blobUrl = URL.createObjectURL(blob);
    }

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    if (mode === 'video') {
        URL.revokeObjectURL(blobUrl);
    }
  };

  return (
    <div className="w-full h-full bg-gray-800 text-white flex flex-col p-4">
      <header className="flex-shrink-0">
        <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1 w-min mb-4">
          <button onClick={() => setMode('image')} className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors ${mode === 'image' ? 'bg-indigo-500' : 'hover:bg-gray-600'}`}>Image</button>
          <button onClick={() => setMode('video')} className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors ${mode === 'video' ? 'bg-indigo-500' : 'hover:bg-gray-600'}`}>Video</button>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Describe the ${mode} you want to create...`}
            className="flex-grow bg-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button onClick={handleGenerate} disabled={isLoading} className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 transition-colors font-semibold">
            {isLoading ? 'Creating...' : 'Generate'}
          </button>
        </div>
      </header>

      <main className="flex-grow bg-gray-900/50 mt-4 rounded-lg flex items-center justify-center relative overflow-hidden">
        {isLoading && (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-indigo-500 border-gray-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-300">Evoking creative energies...</p>
            {mode === 'video' && <p className="text-sm text-gray-400">Video generation may take a few minutes.</p>}
          </div>
        )}
        {error && <p className="text-red-400 p-4 text-center">{error}</p>}
        {result && (
          <>
            {mode === 'image' ? (
              <img src={result} alt={prompt} className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="text-center p-4">
                 <h3 className="text-lg font-semibold">Video Ready!</h3>
                 <p className="text-gray-400 mb-4">Your video has been generated and is ready for download.</p>
              </div>
            )}
            <button onClick={handleDownload} className="absolute bottom-4 right-4 px-3 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold text-sm">
                Download
            </button>
          </>
        )}
        {!result && !isLoading && !error && (
            <p className="text-gray-500">Your creation will appear here.</p>
        )}
      </main>
    </div>
  );
};

export default Imaginarium;