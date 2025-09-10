import React, { useState } from 'react';
import type { ArsisIdCredentials } from '../types';

interface ArsisIdProps {
  currentUser: string | null;
  onCreateUser: (credentials: ArsisIdCredentials) => void;
}

const ArsisId: React.FC<ArsisIdProps> = ({ currentUser, onCreateUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Simple password "hash" for demonstration.
  // In a real app, use a proper library like bcrypt.
  const createHash = (pass: string): string => {
    return btoa(pass.split('').reverse().join(''));
  }

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const hash = createHash(password);
    onCreateUser({ username, hash });
    
    // Reset form
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 p-6 flex flex-col items-center text-center">
      <h1 className="text-2xl font-bold mb-2 dark:text-white">Arsis ID</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Your key to a persistent Macetara experience.
      </p>

      {currentUser ? (
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <p className="dark:text-gray-300">You are logged in as:</p>
            <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">{currentUser}</p>
        </div>
      ) : (
        <form onSubmit={handleCreateAccount} className="w-full space-y-4">
          <h2 className="text-lg font-semibold dark:text-gray-200">Create Your Account</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-md bg-transparent dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md bg-transparent dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-md bg-transparent dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Create Arsis ID
          </button>
        </form>
      )}
    </div>
  );
};

export default ArsisId;
