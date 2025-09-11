import React, { useState, useEffect } from 'react';

interface LoginScreenProps {
  onLogin: (credentials?: { arsisId: string }) => Promise<{ success: boolean; error?: string }>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [time, setTime] = useState(new Date());
  const [arsisId, setArsisId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const formatDate = (date: Date) => date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  const handleLoginAttempt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arsisId.trim()) {
        setError('Please enter an Arsis ID.');
        return;
    }
    setError('');
    setIsLoading(true);
    const result = await onLogin({ arsisId: arsisId.trim().toLowerCase() });
    setIsLoading(false);
    if (!result.success) {
      setError(result.error || 'Login failed. Please try again.');
    }
  };
  
  const handleGuestLogin = async () => {
    setIsLoading(true);
    await onLogin(); // Call without credentials for guest login
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
          <form onSubmit={handleLoginAttempt} className="flex flex-col space-y-4 animate-fade-in">
            <input
              type="text"
              value={arsisId}
              onChange={(e) => setArsisId(e.target.value)}
              placeholder="Enter your Arsis ID"
              className="px-4 py-2 text-center bg-black/20 backdrop-blur-md border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500 disabled:bg-gray-500 transition-colors">
              {isLoading ? 'Connecting...' : 'Connect'}
            </button>
            <button type="button" onClick={handleGuestLogin} disabled={isLoading} className="text-sm text-gray-300 hover:underline">
                Or continue as a Guest
            </button>
          </form>
      </div>
    </div>
  );
};

export default LoginScreen;