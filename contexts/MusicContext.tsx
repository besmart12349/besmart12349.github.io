import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';
import type { MusicTrack, MusicContextType } from '../types';

const PLAYLIST: MusicTrack[] = [
  { title: 'Cozy Fireplace', artist: 'Lofi Beats', duration: 180, src: 'https://www.chosic.com/wp-content/uploads/2021/04/purrple-cat-cozy-place.mp3' },
  { title: 'Midnight Stroll', artist: 'Chillhop', duration: 210, src: 'https://www.chosic.com/wp-content/uploads/2022/01/ghostrifter-official-midnight-stroll.mp3' },
  { title: 'Dreaming', artist: 'Sleepy Fish', duration: 195, src: 'https://www.chosic.com/wp-content/uploads/2021/05/slow-hollows-and-grace-by-ghostrifter-official.mp3' },
  { title: 'Sunday Morning', artist: 'Jazz Cafe', duration: 240, src: 'https://www.chosic.com/wp-content/uploads/2021/04/purrple-cat-dreaming-of-you.mp3' },
];

export const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  const handleNext = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => handleNext();

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', updateProgress);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', updateProgress);
    };
  }, [handleNext]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.src = currentTrack.src;
      if (isPlaying) {
         audio.play().catch(e => console.error("Audio play failed:", e));
      }
    }
  }, [currentTrack, isPlaying]);


  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.error("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    const prevIndex = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentTrackIndex(prevIndex);
  };
  
  const seek = (value: number) => {
    const audio = audioRef.current;
    if (audio) {
        audio.currentTime = (value / 100) * audio.duration;
    }
  };

  const value = {
    isPlaying,
    progress,
    currentTrack,
    currentTime,
    togglePlayPause,
    handleNext,
    handlePrev,
    seek,
  };

  return (
    <MusicContext.Provider value={value}>
      <audio ref={audioRef} />
      {children}
    </MusicContext.Provider>
  );
};