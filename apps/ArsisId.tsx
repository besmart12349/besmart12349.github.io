import React from 'react';

interface ArsisIdProps {
  currentUser: string | null;
}

const ArsisId: React.FC<ArsisIdProps> = ({ currentUser }) => {
  return (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 p-6 flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold mb-2 dark:text-white">Arsis ID</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-xs">
        Your Arsis ID allows your settings, layout, and app data to be saved remotely and accessed from anywhere.
      </p>

      {currentUser ? (
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <p className="dark:text-gray-300">You are logged in with Arsis ID:</p>
            <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 break-all">{currentUser}</p>
        </div>
      ) : (
         <div className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg">
            <p className="font-semibold">Guest Session</p>
            <p className="text-sm">You are currently in a guest session. Your data will not be saved. Restart the OS to log in with an Arsis ID.</p>
        </div>
      )}
    </div>
  );
};

export default ArsisId;