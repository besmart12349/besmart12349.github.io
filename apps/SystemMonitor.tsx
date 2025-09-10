import React, { useState, useEffect } from 'react';

const SystemMonitor: React.FC = () => {
    const [cpu, setCpu] = useState(15);
    const [memory, setMemory] = useState(45);

    useEffect(() => {
        const interval = setInterval(() => {
            setCpu(Math.random() * 30 + 5);
            setMemory(Math.random() * 10 + 40);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const StatBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span>{label}</span>
                <span>{value.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2.5">
                <div className={`${color} h-2.5 rounded-full`} style={{ width: `${value}%` }}></div>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full bg-gray-800 text-white p-4 font-sans flex flex-col space-y-4">
            <h1 className="text-xl font-bold text-center border-b border-gray-700 pb-2">System Monitor</h1>
            <StatBar label="CPU Usage" value={cpu} color="bg-blue-500" />
            <StatBar label="Memory Usage" value={memory} color="bg-green-500" />
            <div className="text-xs text-gray-400 pt-4">
                <p>Mock data updating every 2 seconds.</p>
            </div>
        </div>
    );
};

export default SystemMonitor;
