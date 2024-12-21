import React, { useState, useEffect } from 'react';
import { Umbrella, Shirt, Heart } from 'lucide-react';

// Training data for weather recommendations
const trainingData = {
  // Temperature ranges (in Celsius)
  temp: {
    cold: { min: -20, max: 10 },
    mild: { min: 11, max: 25 },
    hot: { min: 26, max: 45 }
  },
  // Weather conditions
  conditions: {
    clear: ['clear sky', 'few clouds', 'scattered clouds'],
    rain: ['rain', 'shower rain', 'thunderstorm'],
    snow: ['snow'],
    misc: ['mist', 'overcast clouds']
  },
  // Recommendations database
  recommendations: {
    activities: {
      cold: {
        clear: ['Indoor sports', 'Ice skating', 'Winter hiking'],
        snow: ['Skiing', 'Snowboarding', 'Building snowman'],
        misc: ['Visit museums', 'Indoor swimming', 'Shopping']
      },
      mild: {
        clear: ['Outdoor walking', 'Cycling', 'Picnic in park'],
        rain: ['Visit galleries', 'Indoor fitness', 'Coffee shop visit'],
        misc: ['Light hiking', 'Photography', 'Urban exploration']
      },
      hot: {
        clear: ['Swimming', 'Beach activities', 'Early morning exercise'],
        rain: ['Indoor activities', 'Shopping centers', 'Movie theaters'],
        misc: ['Water parks', 'Indoor sports', 'Mall walking']
      }
    },
    clothing: {
      cold: {
        clear: ['Warm jacket', 'Gloves', 'Winter boots'],
        snow: ['Snow boots', 'Thermal wear', 'Waterproof jacket'],
        misc: ['Layered clothing', 'Warm hat', 'Scarf']
      },
      mild: {
        clear: ['Light jacket', 'Comfortable shoes', 'Sunglasses'],
        rain: ['Rain jacket', 'Waterproof shoes', 'Umbrella'],
        misc: ['Light layers', 'Comfortable clothing', 'Cap']
      },
      hot: {
        clear: ['Light clothing', 'Sun hat', 'Sunglasses'],
        rain: ['Light raincoat', 'Quick-dry clothing', 'Waterproof sandals'],
        misc: ['Breathable clothing', 'Light colors', 'Sun protection']
      }
    },
    health: {
      cold: {
        clear: ['Stay hydrated', 'Protect extremities', 'Regular movement'],
        snow: ['Avoid prolonged exposure', 'Watch for ice', 'Wear proper footwear'],
        misc: ['Monitor temperature', 'Indoor exercise', 'Proper ventilation']
      },
      mild: {
        clear: ['Use sunscreen', 'Stay hydrated', 'Regular exercise'],
        rain: ['Watch for slippery surfaces', 'Carry umbrella', 'Waterproof gear'],
        misc: ['Monitor weather changes', 'Moderate activity', 'Stay prepared']
      },
      hot: {
        clear: ['Stay hydrated', 'Avoid peak sun hours', 'Use sunscreen'],
        rain: ['Watch humidity levels', 'Stay dry', 'Indoor activities'],
        misc: ['Monitor heat index', 'Regular hydration', 'Avoid strenuous activity']
      }
    }
  }
};

const WeatherML = ({ weatherData }) => {
  const [recommendations, setRecommendations] = useState(null);
  
  // Classification functions remain the same...
  const classifyTemperature = (temp) => {
    if (temp <= trainingData.temp.cold.max) return 'cold';
    if (temp <= trainingData.temp.mild.max) return 'mild';
    return 'hot';
  };

  const classifyCondition = (condition) => {
    condition = condition.toLowerCase();
    for (const [key, values] of Object.entries(trainingData.conditions)) {
      if (values.some(val => condition.includes(val))) return key;
    }
    return 'misc';
  };

  const generateRecommendations = (temp, condition) => {
    const tempClass = classifyTemperature(temp);
    const conditionClass = classifyCondition(condition);

    return {
      activities: trainingData.recommendations.activities[tempClass][conditionClass],
      clothing: trainingData.recommendations.clothing[tempClass][conditionClass],
      health: trainingData.recommendations.health[tempClass][conditionClass]
    };
  };

  useEffect(() => {
    if (weatherData) {
      const temp = weatherData.main.temp - 273.15;
      const condition = weatherData.weather[0].description;
      const recs = generateRecommendations(temp, condition);
      setRecommendations(recs);
    }
  }, [weatherData]);

  if (!recommendations) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-white/90 text-xl font-light">Smart Recommendations</h3>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-md">
          <div className="flex items-center mb-3">
            <Umbrella className="w-5 h-5 text-white/70 mr-2" />
            <h4 className="text-white/90 font-medium">Activities</h4>
          </div>
          <ul className="space-y-2">
            {recommendations.activities.map((activity, index) => (
              <li key={index} className="text-white/80 text-sm flex items-center">
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full mr-2"></span>
                {activity}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-md">
          <div className="flex items-center mb-3">
            <Shirt className="w-5 h-5 text-white/70 mr-2" />
            <h4 className="text-white/90 font-medium">Clothing</h4>
          </div>
          <ul className="space-y-2">
            {recommendations.clothing.map((item, index) => (
              <li key={index} className="text-white/80 text-sm flex items-center">
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full mr-2"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-md">
          <div className="flex items-center mb-3">
            <Heart className="w-5 h-5 text-white/70 mr-2" />
            <h4 className="text-white/90 font-medium">Health</h4>
          </div>
          <ul className="space-y-2">
            {recommendations.health.map((tip, index) => (
              <li key={index} className="text-white/80 text-sm flex items-center">
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full mr-2"></span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WeatherML;