import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { MacetaraLogo, SleepIcon, WeatherIcon, StocksIcon, XIcon, NewsIcon, CalendarIcon, ClockIcon } from './Icons';
import type { WidgetConfig, WidgetComponentID, UserProfileData, NewsArticle, Alarm } from '../types';
import { useDraggable } from '../hooks/useDraggable';
import { API_KEY } from '../config';

// --- SYSTEM ACTIONS ---

interface SystemOverlayProps {
  action: 'restart' | 'shutdown' | 'sleep';
  onWakeUp: () => void;
}

export const SystemOverlay: React.FC<SystemOverlayProps> = ({ action, onWakeUp }) => {
  React.useEffect(() => {
    if (action === 'restart') {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [action]);

  const getMessage = () => {
    switch (action) {
      case 'restart': return 'Restarting...';
      case 'shutdown': return 'Shutting Down...';
      case 'sleep': return 'Sleeping...';
    }
  };

  const getIcon = () => {
    switch (action) {
      case 'sleep':
        return <SleepIcon className="w-24 h-24 mb-8 text-blue-300" />;
      default:
        return <MacetaraLogo className="w-24 h-24 mb-8 animate-pulse" />;
    }
  }

  const handleClick = () => {
    if (action === 'sleep') {
      onWakeUp();
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center text-white"
      onClick={handleClick}
    >
      {getIcon()}
      <p className="text-2xl">{getMessage()}</p>
      {action === 'sleep' && <p className="text-sm mt-4 text-gray-400">Click anywhere to wake up</p>}
    </div>
  );
};


// --- WIDGETS ---

interface WidgetContainerProps {
    instanceId: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    onPositionChange: (position: { x: number; y: number }) => void;
    onRemove: (instanceId: string) => void;
    children: React.ReactNode;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({ instanceId, position, size, onPositionChange, onRemove, children }) => {
    const { position: currentPosition, dragRef, onMouseDown } = useDraggable(position, undefined, onPositionChange);
    
    return (
        <div
            ref={dragRef}
            style={{
                position: 'absolute',
                top: currentPosition.y,
                left: currentPosition.x,
                width: size.width,
                height: size.height,
                zIndex: 2,
            }}
            className="group"
        >
            <div 
                className="w-full h-full bg-black/20 dark:bg-white/10 backdrop-blur-md rounded-2xl shadow-lg cursor-grab active:cursor-grabbing text-white p-4 overflow-hidden"
                onMouseDown={onMouseDown}
            >
                {children}
            </div>
             <button
                onClick={() => onRemove(instanceId)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/30 rounded-full text-white text-xs items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden group-hover:flex"
                title="Remove Widget"
            >
              <XIcon className="w-3 h-3"/>
            </button>
        </div>
    );
};

export const WeatherWidget: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <WeatherIcon className="w-16 h-16" />
        <p className="text-4xl font-semibold mt-2">18°C</p>
        <p className="text-gray-300">Partly Cloudy</p>
        <p className="text-xs text-gray-400 mt-1">New York</p>
    </div>
);

export const StocksWidget: React.FC = () => (
    <div className="h-full flex flex-col justify-between">
        <h3 className="font-bold text-center border-b border-white/20 pb-1 mb-1">Stocks</h3>
        <div className="flex justify-between text-sm">
            <span>AAPL</span>
            <span className="text-green-400">+1.48%</span>
        </div>
        <div className="flex justify-between text-sm">
            <span>GOOGL</span>
            <span className="text-red-400">-0.45%</span>
        </div>
        <div className="flex justify-between text-sm">
            <span>TSLA</span>
            <span className="text-green-400">+3.63%</span>
        </div>
         <div className="flex justify-between text-sm">
            <span>MSFT</span>
            <span className="text-green-400">+0.33%</span>
        </div>
    </div>
);

export const NewsWidget: React.FC = () => {
    const [headlines, setHeadlines] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHeadlines = async () => {
            try {
                const ai = new GoogleGenAI({ apiKey: API_KEY });
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: "Provide the top 3 latest world news headlines.",
                    config: { responseMimeType: "application/json", responseSchema: {
                        type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                            title: { type: Type.STRING }, source: { type: Type.STRING }, summary: { type: Type.STRING }
                        }}}
                    }
                });
                setHeadlines(JSON.parse(response.text));
            } catch (e) { console.error("News Widget Error:", e); } 
            finally { setIsLoading(false); }
        };
        fetchHeadlines();
    }, []);

    return (
        <div className="h-full flex flex-col">
            <h3 className="font-bold text-lg text-center border-b border-white/20 pb-1 mb-2 flex items-center justify-center space-x-2"><NewsIcon className="w-5 h-5" /> <span>Top Stories</span></h3>
            {isLoading ? <div className="text-xs text-center text-gray-400">Loading...</div> : (
                <div className="space-y-2 overflow-hidden">
                    {headlines.map((item, i) => (
                        <div key={i} className="text-xs">
                            <p className="font-semibold truncate">{item.title}</p>
                            <p className="text-gray-300 truncate">{item.source}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const CalendarWidget: React.FC<{ userData: UserProfileData }> = ({ userData }) => {
    const today = new Date();
    const dateKey = today.toISOString().split('T')[0];
    const eventsToday = userData.calendarEvents?.[dateKey] || [];
    
    return (
        <div className="h-full flex flex-col text-center">
            <div className="bg-red-500 rounded-t-lg -m-4 mb-2 p-1">
                <p className="text-xs font-bold uppercase">{today.toLocaleString('default', { month: 'short' })}</p>
            </div>
            <p className="text-4xl font-bold">{today.getDate()}</p>
            <p className="text-sm text-gray-300 mb-2">{today.toLocaleString('default', { weekday: 'long' })}</p>
            <div className="border-t border-white/20 flex-grow pt-2 text-left text-xs space-y-1 overflow-y-auto">
                {eventsToday.length > 0 ? (
                    eventsToday.map(event => (
                        <div key={event.id} className="truncate">
                            <span className="font-semibold">{event.time}</span> {event.text}
                        </div>
                    ))
                ) : <p className="text-center text-gray-400">No events today</p>}
            </div>
        </div>
    );
};

export const ClockWidget: React.FC<{ userData: UserProfileData }> = ({ userData }) => {
    const [time, setTime] = useState(new Date());
    const use24Hour = userData.clockSettings?.use24Hour || false;

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const timeString = time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: !use24Hour,
    });
    
    const upcomingAlarm = (userData.clockSettings?.alarms || [])
        .filter(a => a.enabled)
        .sort((a,b) => a.time.localeCompare(b.time))
        .find(a => {
            const [alarmHour, alarmMinute] = a.time.split(':').map(Number);
            return alarmHour > time.getHours() || (alarmHour === time.getHours() && alarmMinute > time.getMinutes());
        });

    return (
        <div className="h-full flex flex-col text-center justify-between">
            <div>
                <ClockIcon className="w-8 h-8 mx-auto text-yellow-300" />
                <p className="text-5xl font-semibold mt-2">{timeString}</p>
                <p className="text-sm text-gray-300">{time.toLocaleDateString([], { weekday: 'long' })}</p>
            </div>
            <div className="text-xs text-gray-400 border-t border-white/20 pt-2 mt-2">
                {upcomingAlarm ? (
                    <span>Next Alarm: {upcomingAlarm.time} - {upcomingAlarm.label}</span>
                ) : (
                    <span>No upcoming alarms</span>
                )}
            </div>
        </div>
    );
};


export const WIDGETS: WidgetConfig[] = [
    { id: 'weather-widget', title: 'Weather', component: WeatherWidget, defaultSize: { width: 200, height: 200 } },
    { id: 'stocks-widget', title: 'Stocks', component: StocksWidget, defaultSize: { width: 200, height: 200 } },
    { id: 'news-widget', title: 'News', component: NewsWidget, defaultSize: { width: 250, height: 200 } },
    { id: 'calendar-widget', title: 'Calendar', component: CalendarWidget, defaultSize: { width: 200, height: 200 } },
    { id: 'clock-widget', title: 'Clock', component: ClockWidget, defaultSize: { width: 220, height: 200 } },
];

interface WidgetPickerProps {
    visible: boolean;
    onClose: () => void;
    onAddWidget: (widgetId: WidgetComponentID) => void;
}

export const WidgetPicker: React.FC<WidgetPickerProps> = ({ visible, onClose, onAddWidget }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center" onClick={onClose}>
            <div
                className="w-full max-w-md bg-gray-800/80 backdrop-blur-xl rounded-lg shadow-2xl p-4"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-white text-lg font-bold mb-4">Add a Widget</h2>
                <div className="grid grid-cols-2 gap-4">
                    {WIDGETS.map((widget: WidgetConfig) => (
                        <div key={widget.id} onClick={() => onAddWidget(widget.id)} className="bg-gray-700/50 p-4 rounded-lg cursor-pointer hover:bg-gray-700/80 text-white text-center">
                            <h3 className="font-semibold">{widget.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};