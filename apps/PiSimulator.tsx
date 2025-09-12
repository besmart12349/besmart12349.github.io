import React from 'react';

const PiSimulator: React.FC = () => {
  return (
    <div className="w-full h-full bg-black">
      <iframe
        src="https://rpi-emulator.github.io/v2/"
        title="Raspberry Pi Emulator"
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
};

export default PiSimulator;