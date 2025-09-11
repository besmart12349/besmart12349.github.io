
import React, { useState } from 'react';

interface ArsisIdProps {
  currentUser: string | null;
  onCreateUserFromGuest: (newId: string) => Promise<{ success: boolean; error?: string }>;
}

const ArsisId: React.FC<ArsisIdProps> = ({ currentUser, onCreateUserFromGuest }) => {
  const [newId, setNewId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId.trim()) {
      setError('Please choose an ID.');
      return;
    }
    setIsLoading(true);
    setError('');
    const result = await onCreateUserFromGuest(newId.trim().toLowerCase());
    setIsLoading(false);
    if (!result.success) {
      setError(result.error || 'An unknown error occurred.');
    }
    // On success, the parent component will change the `currentUser` prop,
    // and this component will automatically re-render to the logged-in view.
  };

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
        <form onSubmit={handleCreate} className="w-full max-w-sm space-y-3">
          <div className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 p-3 rounded-lg text-sm">
              <p className="font-semibold">You are in a Guest Session</p>
              <p>Create an Arsis ID to save your current session, including open windows and settings.</p>
          </div>
          <input
            type="text"
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            placeholder="Choose your new Arsis ID"
            className="w-full px-4 py-2 text-center bg-transparent border border-gray-400 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:bg-gray-500 transition-colors">
            {isLoading ? 'Creating...' : 'Create & Save Session'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ArsisId;