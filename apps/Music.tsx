import React, { useContext } from 'react';
import { MusicContext } from '../contexts/MusicContext';

const Music: React.FC = () => {
  const context = useContext(MusicContext);

  if (!context) {
    return <div>Loading Music...</div>;
  }

  const {
    isPlaying,
    progress,
    currentTrack,
    currentTime,
    togglePlayPause,
    handleNext,
    handlePrev,
    seek,
  } = context;
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };


  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black text-white flex flex-col items-center justify-center p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{currentTrack.title}</h2>
        <p className="text-md text-gray-400">{currentTrack.artist}</p>
      </div>

      <div className="w-full max-w-xs">
        <input 
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={onSeek}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
          style={{
             background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${progress}%, #4b5563 ${progress}%, #4b5563 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1 mb-4">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>

        <div className="flex items-center justify-center space-x-8">
          <button onClick={handlePrev} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
          </button>
          <button onClick={togglePlayPause} className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-lg">
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 pl-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
            )}
          </button>
          <button onClick={handleNext} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Music;