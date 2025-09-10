import React from 'react';
import { MacetaraLogo } from './Icons';

interface LoadingScreenProps {
  progress: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  return (
    <div className="fixed inset-0 bg-[#0d0d0d] z-[9999] flex flex-col items-center justify-center text-white">
      <MacetaraLogo className="w-24 h-24 mb-8 text-gray-300" />
      <div className="w-64 bg-gray-700/50 rounded-full h-1.5">
        <div 
          className="bg-gray-200 h-1.5 rounded-full" 
          style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingScreen;