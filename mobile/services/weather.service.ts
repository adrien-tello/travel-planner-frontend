export interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  feelsLike: number;
}

export class WeatherService {
  private static readonly API_KEY = 'your_openweather_api_key'; // Replace with actual API key
  private static readonly BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  static async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData | null> {
    try {
      // For demo purposes, return mock data if no API key
      if (!this.API_KEY || this.API_KEY === 'your_openweather_api_key') {
        return this.getMockWeatherData();
      }

      const response = await fetch(
        `${this.BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${this.API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Weather API request failed');
      }

      const data = await response.json();

      return {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon,
        feelsLike: Math.round(data.main.feels_like)
      };
    } catch (error) {
      console.error('Weather error:', error);
      return this.getMockWeatherData();
    }
  }

  private static getMockWeatherData(): WeatherData {
    const conditions = [
      { condition: 'Clear', description: 'Clear sky', icon: '01d', temp: 22 },
      { condition: 'Clouds', description: 'Partly cloudy', icon: '02d', temp: 18 },
      { condition: 'Rain', description: 'Light rain', icon: '10d', temp: 15 },
      { condition: 'Snow', description: 'Light snow', icon: '13d', temp: -2 }
    ];

    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

    return {
      temperature: randomCondition.temp,
      condition: randomCondition.condition,
      description: randomCondition.description,
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
      icon: randomCondition.icon,
      feelsLike: randomCondition.temp + Math.floor(Math.random() * 6) - 3
    };
  }

  static getWeatherIcon(condition: string): string {
    const iconMap: { [key: string]: string } = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️'
    };
    return iconMap[condition] || '🌤️';
  }
}