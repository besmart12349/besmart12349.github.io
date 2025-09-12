import React, { useState, useEffect, useRef } from 'react';
import { LockIcon } from './Icons';

interface PasscodePromptProps {
  action: 'set' | 'enter';
  appName?: string;
  onClose: () => void;
  onConfirm: (passcode: string) => void;
}

const PasscodePrompt: React.FC<PasscodePromptProps> = ({ action, appName, onClose, onConfirm }) => {
  const [passcode, setPasscode] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const title = action === 'set' ? 'Set Passcode' : `Unlock ${appName || 'App'}`;
  const promptText = action === 'set' ? 'Create a 4-digit passcode for locking apps.' : 'Enter your 4-digit passcode.';
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === '') {
      const newPasscode = [...passcode];
      newPasscode[index] = value;
      setPasscode(newPasscode);
      setError(false);

      if (value !== '' && index < 3) {
        inputsRef.current[index + 1]?.focus();
      }
      
      if (newPasscode.every(digit => digit !== '')) {
        setTimeout(() => handleSubmit(newPasscode.join('')), 100);
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && passcode[index] === '' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (finalPasscode: string) => {
    if (finalPasscode.length === 4) {
      onConfirm(finalPasscode);
    }
    // Simple error feedback
    setError(true);
    setPasscode(['','','','']);
    inputsRef.current[0]?.focus();
  };


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center" onClick={onClose}>
      <div 
        className="w-full max-w-sm bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-lg shadow-2xl p-6 text-center"
        onClick={e => e.stopPropagation()}
      >
        <LockIcon className="w-12 h-12 text-gray-700 dark:text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{promptText}</p>
        
        <div className={`flex justify-center space-x-3 mb-4 ${error && action === 'enter' ? 'animate-shake' : ''}`}>
          {passcode.map((digit, index) => (
            <input
              key={index}
              // FIX: The ref callback was implicitly returning a value, which is not allowed. Changed to a block statement to ensure a void return.
              ref={el => { inputsRef.current[index] = el; }}
              type="password"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-center text-3xl font-semibold bg-white/50 dark:bg-black/20 rounded-lg border-2 border-gray-400/50 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
            />
          ))}
        </div>
         <button onClick={onClose} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Cancel
        </button>
      </div>
    </div>
  );
};

export default PasscodePrompt;
