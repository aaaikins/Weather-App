import React, { useState } from 'react';
import WeatherML from './WeatherML';
import { Search, Droplets, Wind, Sun } from 'lucide-react';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = "ec817214e892ea84673d8b4b8a6a273f";

  const getWeather = async () => {
    if (!city) {
      setError('Please enter a city');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`)
      ]);

      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();

      if (weatherData.cod === '404') {
        setError(weatherData.message);
        return;
      }

      setCurrentWeather(weatherData);
      setForecast(forecastData.list.slice(0, 8));
    } catch (err) {
      setError('Error fetching weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const kelvinToCelsius = (kelvin) => Math.round(kelvin - 273.15);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-white/20">
        {/* Search Section */}
        <div className="relative mb-8">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter City"
            className="w-full bg-white/20 text-white placeholder-white/70 rounded-xl px-4 py-3 pr-12
                     border border-white/30 focus:outline-none focus:border-white/50 transition-all"
            onKeyPress={(e) => e.key === 'Enter' && getWeather()}
          />
          <button
            onClick={getWeather}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white
                     transition-colors disabled:opacity-50"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="text-red-200 text-center mb-6 bg-red-500/20 rounded-lg p-3">
            {error}
          </div>
        )}

        {currentWeather && !error && (
          <div className="space-y-8">
            {/* Current Weather */}
            <div className="text-center">
              <div className="relative inline-block">
                {currentWeather.weather[0].icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`}
                    alt={currentWeather.weather[0].description}
                    className="w-32 h-32 mx-auto"
                  />
                )}
              </div>
              
              <div className="text-7xl font-light text-white mb-2">
                {kelvinToCelsius(currentWeather.main.temp)}°C
              </div>
              
              <div className="text-2xl text-white/90 font-light">
                {currentWeather.name}
              </div>
              <div className="text-lg text-white/80 capitalize">
                {currentWeather.weather[0].description}
              </div>

              {/* Weather Details */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 rounded-xl p-3">
                  <Droplets className="w-6 h-6 text-white/70 mx-auto mb-2" />
                  <div className="text-white/90">{currentWeather.main.humidity}%</div>
                  <div className="text-white/70 text-sm">Humidity</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <Wind className="w-6 h-6 text-white/70 mx-auto mb-2" />
                  <div className="text-white/90">{Math.round(currentWeather.wind.speed)} m/s</div>
                  <div className="text-white/70 text-sm">Wind</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <Sun className="w-6 h-6 text-white/70 mx-auto mb-2" />
                  <div className="text-white/90">{Math.round(currentWeather.main.feels_like - 273.15)}°C</div>
                  <div className="text-white/70 text-sm">Feels Like</div>
                </div>
              </div>
            </div>

            {/* Hourly Forecast */}
            {forecast.length > 0 && (
              <div>
                <h3 className="text-white/90 text-lg mb-4">Hourly Forecast</h3>
                <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
                  {forecast.map((item, index) => (
                    <div key={index} 
                         className="bg-white/10 rounded-xl p-3 text-center transition-transform hover:scale-105">
                      <span className="text-white/90 text-sm">
                        {new Date(item.dt * 1000).getHours()}:00
                      </span>
                      <img
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                        alt="Hourly Weather Icon"
                        className="w-8 h-8 mx-auto"
                      />
                      <span className="text-white/90 text-sm">
                        {kelvinToCelsius(item.main.temp)}°C
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ML Recommendations */}
            <WeatherML weatherData={currentWeather} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;