import React from 'react';
import { MacetaraLogo } from '../components/Icons';

const About: React.FC = () => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-center p-6 text-center dark:from-gray-800 dark:to-gray-900 dark:text-white">
      <MacetaraLogo className="w-20 h-20 text-gray-700 dark:text-gray-300 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">ArsisOS</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Version 2.0 (Maverick)</p>
      <p className="text-xs text-gray-500 dark:text-gray-500">
        A macOS-like desktop environment built with React and Tailwind CSS.
      </p>
    </div>
  );
};

export default About;