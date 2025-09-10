import React, { useState } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState(0);

  const handleButtonClick = (value: string) => {
    if (display === 'Error') {
      setDisplay(value === 'C' ? '0' : value);
      return;
    }
    
    switch (value) {
      case 'C':
        setDisplay('0');
        break;
      case '=':
        calculate();
        break;
      case '+/-':
        // This is tricky with an expression. Let's make it operate on the whole expression for now.
        setDisplay(prev => `-${'('}${prev}${')'}`);
        break;
      case '%':
        // This also is tricky. Let's make it divide the whole expression by 100
        setDisplay(prev => `${'('}${prev}${')'}/100`);
        break;
      case '√':
         setDisplay(prev => prev === '0' ? 'sqrt(' : prev + 'sqrt(');
        break;
      case 'x²':
        setDisplay(prev => prev + '**2');
        break;
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(prev => prev === '0' ? String(memory) : prev + String(memory));
        break;
      case 'M+':
        setMemory(prev => prev + (parseFloat(display) || 0)); // simple version for now
        break;
      case 'M-':
        setMemory(prev => prev - (parseFloat(display) || 0)); // simple version for now
        break;
      default:
        setDisplay(prev => (prev === '0' && value !== '.') ? value : prev + value);
    }
  };
  
  const calculate = () => {
    try {
        let expr = display.replace(/sqrt/g, 'Math.sqrt');
        
        // A simple check for invalid characters, not foolproof but better than nothing.
        const validChars = /^[0-9.+\-*/()\s\bMath.sqrt\b]+$/;
        if (!validChars.test(expr)) {
            setDisplay('Error');
            return;
        }

        // Unbalanced parentheses check
        if (expr.match(/\(/g)?.length !== expr.match(/\)/g)?.length) {
            setDisplay('Error');
            return;
        }

        const result = new Function('return ' + expr)();
        setDisplay(String(result));
    } catch (error) {
        setDisplay('Error');
    }
  };

  const buttons = [
    { val: 'MC', type: 'func' }, { val: 'MR', type: 'func' }, { val: 'M-', type: 'func' }, { val: 'M+', type: 'func' },
    { val: '(', type: 'func' }, { val: ')', type: 'func' }, { val: '√', type: 'func' }, { val: 'x²', type: 'func' },
    { val: 'C', type: 'func' }, { val: '+/-', type: 'func' }, { val: '%', type: 'func' }, { val: '/', type: 'op' },
    { val: '7' }, { val: '8' }, { val: '9' }, { val: '*', type: 'op' },
    { val: '4' }, { val: '5' }, { val: '6' }, { val: '-', type: 'op' },
    { val: '1' }, { val: '2' }, { val: '3' }, { val: '+', type: 'op' },
    { val: '0', span: 2 }, { val: '.' }, { val: '=', type: 'op' },
  ];
  
  const Button: React.FC<{ val: string, type?: string, span?: number }> = ({ val, type, span = 1 }) => {
    let bgColor = 'bg-gray-700 hover:bg-gray-600 text-white';
    if (type === 'op') bgColor = 'bg-orange-500 hover:bg-orange-600 text-white';
    if (type === 'func') bgColor = 'bg-gray-500 hover:bg-gray-400 text-black';
    
    return (
      <button 
        onClick={() => handleButtonClick(val)} 
        className={`text-xl p-4 rounded-full ${bgColor} ${span === 2 ? 'col-span-2' : ''} transition-colors duration-150 flex items-center justify-center`}
      >
        {val === 'x²' ? <span>x<sup>2</sup></span> : val}
      </button>
    );
  }

  const displayFontSize = display.length > 15 ? 'text-3xl' : display.length > 10 ? 'text-4xl' : 'text-5xl';

  return (
    <div className="w-full h-full bg-black flex flex-col p-2">
      <div className={`flex-grow text-white text-right p-4 mb-2 font-thin flex items-end justify-end break-all ${displayFontSize} transition-all`}>
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn, i) => (
           <Button key={i} {...btn} />
        ))}
      </div>
    </div>
  );
};

export default Calculator;