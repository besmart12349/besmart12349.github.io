import React, { useState, useEffect } from 'react';

interface LoginScreenProps {
  onLogin: (credentials?: { username: string, password?: string }) => Promise<{ success: boolean, error?: string }>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [time, setTime] = useState(new Date());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const formatDate = (date: Date) => date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  const handleLoginAttempt = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await onLogin({ username, password });
    setIsLoading(false);
    if (!result.success) {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    await onLogin();
    setIsLoading(false);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-white backdrop-blur-sm bg-black/10 animate-fade-in">
      <div className="flex-grow flex flex-col items-center justify-center text-center pt-24">
        <h1 className="text-8xl font-thin" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
          {formatTime(time)}
        </h1>
        <p className="text-2xl mt-2" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
          {formatDate(time)}
        </p>
      </div>
      <div className="pb-24 w-full max-w-xs">
        {showLoginForm ? (
          <form onSubmit={handleLoginAttempt} className="flex flex-col space-y-4 animate-fade-in">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="px-4 py-2 bg-black/20 backdrop-blur-md border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="px-4 py-2 bg-black/20 backdrop-blur-md border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500 disabled:bg-gray-500 transition-colors">
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
            <button type="button" onClick={() => setShowLoginForm(false)} className="text-sm text-gray-300 hover:underline">
                Cancel
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center space-y-4 animate-fade-in">
             <div className="flex items-center space-x-4">
                <button onClick={() => setShowLoginForm(true)} className="px-6 py-2 bg-white/20 backdrop-blur-md border border-white/20 rounded-md hover:bg-white/30 transition-colors">
                    Log In
                </button>
                <button onClick={handleGuestLogin} disabled={isLoading} className="px-6 py-2 bg-white/20 backdrop-blur-md border border-white/20 rounded-md hover:bg-white/30 transition-colors">
                    {isLoading ? 'Loading...' : 'Guest'}
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
