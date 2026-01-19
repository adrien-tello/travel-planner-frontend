export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  description: string;
}

export class WeatherService {
  async getWeather(latitude: number, longitude: number): Promise<WeatherData | null> {
    try {
      // Using Open-Meteo API (free, no API key required)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`,
        { 
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.current) {
        throw new Error('Invalid weather API response');
      }

      const weatherCode = data.current.weather_code || 0;
      const condition = this.getWeatherCondition(weatherCode);

      return {
        temperature: Math.round(data.current.temperature_2m || 0),
        condition: condition.main,
        humidity: data.current.relative_humidity_2m || 0,
        windSpeed: data.current.wind_speed_10m || 0,
        icon: condition.icon,
        description: condition.description,
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      return this.getMockWeather();
    }
  }

  async getForecast(latitude: number, longitude: number): Promise<WeatherData[]> {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,weather_code&timezone=auto&forecast_days=5`
      );

      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.daily) {
        return [this.getMockWeather()];
      }

      return data.daily.temperature_2m_max.slice(0, 5).map((temp: number, index: number) => {
        const weatherCode = data.daily.weather_code[index] || 0;
        const condition = this.getWeatherCondition(weatherCode);
        
        return {
          temperature: Math.round(temp || 0),
          condition: condition.main,
          humidity: 65, // Default value for forecast
          windSpeed: 0,
          icon: condition.icon,
          description: condition.description,
        };
      });
    } catch (error) {
      console.error('Error fetching forecast:', error);
      return [this.getMockWeather()];
    }
  }

  private getWeatherCondition(code: number): { main: string; description: string; icon: string } {
    // WMO Weather interpretation codes
    if (code === 0) return { main: 'Clear', description: 'Clear sky', icon: '01d' };
    if (code <= 3) return { main: 'Clouds', description: 'Partly cloudy', icon: '02d' };
    if (code <= 48) return { main: 'Fog', description: 'Foggy', icon: '50d' };
    if (code <= 67) return { main: 'Rain', description: 'Light rain', icon: '10d' };
    if (code <= 77) return { main: 'Snow', description: 'Snow', icon: '13d' };
    if (code <= 82) return { main: 'Rain', description: 'Heavy rain', icon: '09d' };
    if (code <= 99) return { main: 'Thunderstorm', description: 'Thunderstorm', icon: '11d' };
    
    return { main: 'Unknown', description: 'Unknown weather', icon: '01d' };
  }

  private getMockWeather(): WeatherData {
    return {
      temperature: 22,
      condition: 'Clear',
      humidity: 65,
      windSpeed: 3.2,
      icon: '01d',
      description: 'Clear sky (demo)',
    };
  }
}