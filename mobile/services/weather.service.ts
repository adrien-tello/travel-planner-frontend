import { LocationService, LocationData } from './location.service';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

export class WeatherService {
  private static instance: WeatherService;
  private readonly API_KEY = 'demo'; // Replace with actual API key

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  async getCurrentWeather(location?: string): Promise<WeatherData> {
    try {
      // Get user's current location
      const userLocation = await LocationService.getCurrentLocation();
      
      if (userLocation) {
        // Use actual location data
        const locationName = userLocation.city && userLocation.country 
          ? `${userLocation.city}, ${userLocation.country}`
          : userLocation.city || 'Current Location';
        
        // Generate weather based on location (mock data for demo)
        return this.generateWeatherForLocation(locationName, userLocation);
      }
    } catch (error) {
      console.error('Failed to get user location:', error);
    }

    // Fallback to mock data if location fails
    return this.getMockWeatherData();
  }

  private generateWeatherForLocation(locationName: string, location: LocationData): WeatherData {
    // Generate realistic weather based on coordinates (simplified)
    const lat = location.latitude;
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'];
    const icons = ['☀️', '⛅', '☁️', '🌧️'];
    
    // Simple weather generation based on latitude
    const tempBase = lat > 0 ? (lat > 40 ? 15 : 25) : 30; // Northern vs Southern hemisphere
    const conditionIndex = Math.floor(Math.random() * conditions.length);
    
    return {
      location: locationName,
      temperature: Math.round(tempBase + (Math.random() * 15) - 5),
      condition: conditions[conditionIndex],
      icon: icons[conditionIndex],
      humidity: Math.round(50 + Math.random() * 40),
      windSpeed: Math.round(5 + Math.random() * 20),
      feelsLike: Math.round(tempBase + (Math.random() * 10) - 3)
    };
  }

  private getMockWeatherData(): WeatherData {
    const mockWeatherData: WeatherData[] = [
      {
        location: 'Current Location',
        temperature: 22,
        condition: 'Sunny',
        icon: '☀️',
        humidity: 65,
        windSpeed: 12,
        feelsLike: 24
      },
      {
        location: 'Your Area',
        temperature: 18,
        condition: 'Cloudy',
        icon: '☁️',
        humidity: 78,
        windSpeed: 8,
        feelsLike: 16
      }
    ];

    return mockWeatherData[Math.floor(Math.random() * mockWeatherData.length)];
  }
}