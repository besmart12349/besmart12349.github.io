import React, { useState, useEffect, useCallback } from 'react';
import type { Alarm } from '../types';
import { PlusIcon, XIcon } from '../components/Icons';

interface ClockSettings {
    use24Hour: boolean;
    timezones: string[];
    alarms: Alarm[];
}

interface ClockProps {
    settings: ClockSettings;
    onSettingsChange: (settings: ClockSettings) => void;
}

type Tab = 'world' | 'alarm' | 'stopwatch' | 'settings';

const Clock: React.FC<ClockProps> = ({ settings, onSettingsChange }) => {
    const [activeTab, setActiveTab] = useState<Tab>('world');
    const { use24Hour, timezones, alarms } = settings;

    // --- World Clock Logic ---
    const [worldTimes, setWorldTimes] = useState<Date[]>([]);
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setWorldTimes(timezones.map(tz => {
                try {
                    return new Date(now.toLocaleString('en-US', { timeZone: tz }));
                } catch (e) {
                    // Fallback for invalid timezone strings
                    return now;
                }
            }));
        }, 1000);
        return () => clearInterval(timer);
    }, [timezones]);

    // --- Alarm Logic ---
    const handleToggleAlarm = (id: number) => {
        const newAlarms = alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a);
        onSettingsChange({ ...settings, alarms: newAlarms });
    };

    const handleAddAlarm = (time: string, label: string) => {
        const newAlarm: Alarm = { id: Date.now(), time, label, enabled: true };
        onSettingsChange({ ...settings, alarms: [...alarms, newAlarm] });
    };

    const handleDeleteAlarm = (id: number) => {
        onSettingsChange({ ...settings, alarms: alarms.filter(a => a.id !== id) });
    };

    // --- Stopwatch Logic ---
    const [stopwatchTime, setStopwatchTime] = useState(0);
    const [stopwatchRunning, setStopwatchRunning] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);
    const stopwatchIntervalRef = React.useRef<number | null>(null);

    useEffect(() => {
        if (stopwatchRunning) {
            const startTime = Date.now() - stopwatchTime;
            stopwatchIntervalRef.current = window.setInterval(() => {
                setStopwatchTime(Date.now() - startTime);
            }, 10);
        } else {
            if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
        }
        return () => {
            if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
        };
    }, [stopwatchRunning, stopwatchTime]);

    const formatStopwatchTime = (time: number) => {
        const minutes = Math.floor(time / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, '0');
        const milliseconds = (time % 1000).toString().padStart(3, '0').slice(0, 2);
        return `${minutes}:${seconds}.${milliseconds}`;
    };

    const TabButton: React.FC<{ tabId: Tab, label: string }> = ({ tabId, label }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tabId ? 'bg-indigo-500 text-white' : 'hover:bg-gray-700'}`}
        >
            {label}
        </button>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'world': return <WorldClockTab times={worldTimes} timezones={timezones} use24Hour={use24Hour} />;
            case 'alarm': return <AlarmTab alarms={alarms} onAdd={handleAddAlarm} onToggle={handleToggleAlarm} onDelete={handleDeleteAlarm} use24Hour={use24Hour} />;
            case 'stopwatch': return <StopwatchTab time={stopwatchTime} isRunning={stopwatchRunning} laps={laps} onStartStop={() => setStopwatchRunning(!stopwatchRunning)} onLapReset={() => {
                if (stopwatchRunning) setLaps([stopwatchTime, ...laps]);
                else { setStopwatchTime(0); setLaps([]); }
            }} formatTime={formatStopwatchTime} />;
            case 'settings': return <SettingsTab use24Hour={use24Hour} onToggle24Hour={() => onSettingsChange({ ...settings, use24Hour: !use24Hour })} />;
        }
    };

    return (
        <div className="w-full h-full bg-gray-800 text-white flex flex-col p-4">
            <header className="flex-shrink-0 flex items-center justify-center space-x-2 bg-gray-700/50 rounded-lg p-1 w-min mx-auto mb-4">
                <TabButton tabId="world" label="World Clock" />
                <TabButton tabId="alarm" label="Alarms" />
                <TabButton tabId="stopwatch" label="Stopwatch" />
                <TabButton tabId="settings" label="Settings" />
            </header>
            <main className="flex-grow bg-gray-900/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                {renderContent()}
            </main>
        </div>
    );
};

// --- TAB COMPONENTS ---

const WorldClockTab: React.FC<{ times: Date[], timezones: string[], use24Hour: boolean }> = ({ times, timezones, use24Hour }) => {
    return (
        <div className="w-full h-full p-4 overflow-y-auto">
            <h2 className="text-xl font-bold text-center mb-4">World Clock</h2>
            <ul className="space-y-3">
                {times.map((time, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                        <span className="font-semibold">{timezones[index].split('/')[1]?.replace('_', ' ')}</span>
                        <span className="text-2xl font-mono">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: !use24Hour })}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const AlarmTab: React.FC<{ alarms: Alarm[], onAdd: (t: string, l: string) => void, onToggle: (id: number) => void, onDelete: (id: number) => void, use24Hour: boolean }> = ({ alarms, onAdd, onToggle, onDelete }) => {
    const [newTime, setNewTime] = useState('08:00');
    const [newLabel, setNewLabel] = useState('Wake Up');
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(newTime, newLabel);
        setShowForm(false);
    };

    return (
        <div className="w-full h-full p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Alarms</h2>
                <button onClick={() => setShowForm(!showForm)} className="p-1.5 bg-blue-600 rounded-full hover:bg-blue-500"><PlusIcon className="w-5 h-5" /></button>
            </div>
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-gray-800 p-3 rounded-lg mb-4 space-y-2">
                    <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full bg-gray-700 p-1.5 rounded" />
                    <input type="text" value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Alarm label" className="w-full bg-gray-700 p-1.5 rounded" />
                    <button type="submit" className="w-full p-2 bg-green-600 rounded">Add Alarm</button>
                </form>
            )}
            <ul className="flex-grow overflow-y-auto space-y-2">
                {alarms.map(alarm => (
                    <li key={alarm.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                        <div>
                            <p className="text-2xl">{alarm.time}</p>
                            <p className="text-sm text-gray-400">{alarm.label}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                             <button onClick={() => onDelete(alarm.id)}><XIcon className="w-4 h-4 text-red-500" /></button>
                             <input type="checkbox" checked={alarm.enabled} onChange={() => onToggle(alarm.id)} className="w-5 h-5 rounded" />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const StopwatchTab: React.FC<{ time: number, isRunning: boolean, laps: number[], onStartStop: () => void, onLapReset: () => void, formatTime: (t: number) => string }> = ({ time, isRunning, laps, onStartStop, onLapReset, formatTime }) => (
    <div className="w-full h-full p-4 flex flex-col items-center">
        <div className="text-6xl font-mono mb-6 mt-4">{formatTime(time)}</div>
        <div className="flex space-x-4 mb-4">
            <button onClick={onLapReset} className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">{isRunning ? 'Lap' : 'Reset'}</button>
            <button onClick={onStartStop} className={`w-20 h-20 rounded-full flex items-center justify-center ${isRunning ? 'bg-red-600' : 'bg-green-600'}`}>{isRunning ? 'Stop' : 'Start'}</button>
        </div>
        <ul className="w-full flex-grow overflow-y-auto border-t border-gray-700 pt-2 text-sm font-mono">
            {laps.map((lap, i) => (
                <li key={i} className="flex justify-between p-1.5 border-b border-gray-800">
                    <span>Lap {laps.length - i}</span>
                    <span>{formatTime(lap)}</span>
                </li>
            ))}
        </ul>
    </div>
);

const SettingsTab: React.FC<{ use24Hour: boolean, onToggle24Hour: () => void }> = ({ use24Hour, onToggle24Hour }) => (
     <div className="w-full h-full p-4">
        <h2 className="text-xl font-bold text-center mb-4">Clock Settings</h2>
        <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
            <label className="font-semibold">Use 24-Hour Time</label>
            <input type="checkbox" checked={use24Hour} onChange={onToggle24Hour} className="w-5 h-5 rounded" />
        </div>
    </div>
);

export default Clock;
