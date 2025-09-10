import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface WeatherData {
  temperature: number;
  condition: string;
  emoji: string;
}

interface WeatherProps {
    onApiCall?: () => void;
}

const Weather: React.FC<WeatherProps> = ({ onApiCall }) => {
  const [city, setCity] = useState('New York');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const fetchWeather = async (searchCity: string) => {
    if (!searchCity) return;
    setIsLoading(true);
    setError(null);
    setWeather(null);
    onApiCall?.();

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Get the current weather for ${searchCity}.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    temperature: { type: Type.NUMBER, description: "Temperature in Celsius" },
                    condition: { type: Type.STRING, description: "A brief description of the weather condition" },
                    emoji: { type: Type.STRING, description: "A single emoji that represents the weather condition" }
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
    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 text-white p-6 flex flex-col items-center">
      <form onSubmit={handleSearch} className="w-full mb-6">
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
          <>
            <h2 className="text-3xl font-bold capitalize">{city}</h2>
            <div className="text-8xl my-4">{weather.emoji}</div>
            <p className="text-6xl font-light">{weather.temperature}°C</p>
            <p className="text-xl mt-2">{weather.condition}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Weather;