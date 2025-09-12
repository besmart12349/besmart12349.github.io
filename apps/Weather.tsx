import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { API_KEY } from '../config';
import type { WeatherData } from '../types';

interface WeatherProps {
    onApiCall?: () => void;
}

const Weather: React.FC<WeatherProps> = ({ onApiCall }) => {
  const [city, setCity] = useState('New York');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const fetchWeather = async (searchCity: string) => {
    if (!searchCity) return;
    setIsLoading(true);
    setError(null);
    setWeather(null);
    onApiCall?.();

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Get the current weather, 24-hour hourly forecast, and 7-day daily forecast for ${searchCity}.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    temperature: { type: Type.NUMBER, description: "Current temperature in Celsius" },
                    condition: { type: Type.STRING, description: "A brief description of the current weather condition" },
                    emoji: { type: Type.STRING, description: "A single emoji that represents the current weather condition" },
                    hourly: {
                        type: Type.ARRAY,
                        description: "The 24-hour forecast, one entry per hour.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                time: { type: Type.STRING, description: "The hour for the forecast, e.g., '14:00'" },
                                temp: { type: Type.NUMBER, description: "The temperature in Celsius for that hour" },
                                emoji: { type: Type.STRING, description: "A single emoji for the condition at that hour" },
                            }
                        }
                    },
                    daily: {
                        type: Type.ARRAY,
                        description: "The 7-day forecast.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                day: { type: Type.STRING, description: "The day of the week, e.g., 'Tuesday'" },
                                high: { type: Type.NUMBER, description: "The high temperature in Celsius" },
                                low: { type: Type.NUMBER, description: "The low temperature in Celsius" },
                                emoji: { type: Type.STRING, description: "A single emoji for the day's primary condition" },
                            }
                        }
                    }
                }
            }
        }
      });
      
      const weatherData: WeatherData = JSON.parse(response.text);
      setWeather(weatherData);

    } catch (e) {
      console.error("Weather AI Error:", e);
      setError("Could not fetch weather data. Please try again.");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
  };
  
  React.useEffect(() => {
    fetchWeather('New York');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 text-white p-4 flex flex-col font-sans">
      <form onSubmit={handleSearch} className="w-full mb-4 flex-shrink-0">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search for a city..."
          className="w-full px-4 py-2 rounded-full bg-white/20 focus:outline-none focus:bg-white/30 placeholder-gray-300 text-white"
        />
      </form>
      
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        {isLoading && (
          <div className="w-12 h-12 border-4 border-t-white/80 border-white/30 rounded-full animate-spin"></div>
        )}
        {error && <p className="text-red-300 bg-red-900/50 p-2 rounded">{error}</p>}
        {weather && !isLoading && (
          <div className="w-full flex flex-col items-center">
            <h2 className="text-3xl font-bold capitalize flex-shrink-0">{city}</h2>
            <div className="text-8xl my-2 flex-shrink-0">{weather.emoji}</div>
            <p className="text-6xl font-light flex-shrink-0">{weather.temperature}°C</p>
            <p className="text-xl mt-1 mb-6 flex-shrink-0">{weather.condition}</p>
            
            {/* Hourly Forecast */}
            <div className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-4 flex-shrink-0">
                <h3 className="text-sm font-semibold uppercase text-gray-300 mb-2 text-left">Hourly Forecast</h3>
                <div className="flex space-x-4 overflow-x-auto pb-2 -mb-2">
                    {weather.hourly.map((hour, index) => (
                        <div key={index} className="flex flex-col items-center flex-shrink-0 w-16 text-center">
                            <span className="text-xs text-gray-200">{hour.time}</span>
                            <span className="text-2xl my-1">{hour.emoji}</span>
                            <span className="font-semibold">{hour.temp}°</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Daily Forecast */}
             <div className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-3 flex-shrink-0">
                <h3 className="text-sm font-semibold uppercase text-gray-300 mb-2 text-left">7-Day Forecast</h3>
                <div className="space-y-1">
                   {weather.daily.map((day, index) => (
                       <div key={index} className="flex items-center justify-between text-sm">
                           <span className="font-medium w-1/3 text-left">{day.day}</span>
                           <span className="text-2xl w-1/3 text-center">{day.emoji}</span>
                           <div className="w-1/3 text-right">
                               <span className="font-semibold mr-2">{day.high}°</span>
                               <span className="text-gray-300">{day.low}°</span>
                           </div>
                       </div>
                   ))}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;