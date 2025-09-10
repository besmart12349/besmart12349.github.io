import React, { useState, useRef, useEffect } from 'react';

const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(['ArsisOS v2.0 Maverick Terminal', 'Type `help` for a list of commands.']);
  const endOfHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (command: string) => {
    let output = '';
    const [cmd, ...args] = command.toLowerCase().split(' ');
    
    switch (cmd) {
      case 'help':
        output = 'Available commands: help, clear, date, echo, neofetch, whoami, cowsay, bin';
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'date':
        output = new Date().toString();
        break;
      case 'echo':
        output = args.join(' ');
        break;
      case 'whoami':
        output = 'guest';
        break;
      case 'cowsay':
        const message = args.join(' ');
        if (!message) {
            output = 'What should the cow say? Try `cowsay hello`';
        } else {
            const topBar = ' ' + '_'.repeat(message.length + 2);
            const bottomBar = ' ' + '-'.repeat(message.length + 2);
            output = `
${topBar}
< ${message} >
${bottomBar}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
        `;
        }
        break;
      case 'neofetch':
        output = `
          _      _
         / \\    (_)  _ __    _ __
        / _ \\   | | | '_ \\  | '_ \\
       / ___ \\  | | | |_) | | |_) |
      /_/   \\_\\ |_| | .__/  | .__/
                     |_|     |_|
      ---------------------------
      OS: ArsisOS v2.0 Maverick
      Kernel: React.js
      Shell: FakeTerm
      Resolution: Your Screen
      UI: TailwindCSS
        `;
        break;
      case 'bin':
        const commandHistory = history
          .filter(line => line.startsWith('> '))
          .map(line => line.substring(2));
        if (commandHistory.length > 0) {
          output = commandHistory.join('\n');
        } else {
          output = 'No commands in history.';
        }
        break;
      default:
        output = `command not found: ${command}`;
    }
    setHistory(h => [...h, `> ${command}`, output]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      handleCommand(input.trim());
      setInput('');
    }
  };

  return (
    <div className="w-full h-full bg-[#0D0221] text-[#00FF41] p-2 font-mono text-sm flex flex-col" onClick={() => document.getElementById('terminal-input')?.focus()}>
      <div className="flex-grow overflow-y-auto pr-2">
        {history.map((line, index) => (
          <pre key={index} className="whitespace-pre-wrap break-words">{line}</pre>
        ))}
        <div ref={endOfHistoryRef} />
      </div>
      <div className="flex items-center">
        <span className="text-[#00FF41]">&gt;</span>
        <input
          id="terminal-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-grow bg-transparent border-none focus:outline-none ml-2 text-[#00FF41]"
          autoFocus
        />
      </div>
    </div>
  );
};

export default Terminal;