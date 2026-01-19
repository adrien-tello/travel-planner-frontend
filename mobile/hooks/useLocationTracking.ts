import { useState, useEffect, useRef } from 'react';
import { LocationService, LocationData } from '../services/location.service';
import { WeatherService, WeatherData } from '../services/weather.service';
import { NotificationService } from '../services/notification.service';

interface LocationTrackingState {
  currentLocation: LocationData | null;
  weather: WeatherData | null;
  isTracking: boolean;
  permissionGranted: boolean;
  error: string | null;
}

export const useLocationTracking = () => {
  const [state, setState] = useState<LocationTrackingState>({
    currentLocation: null,
    weather: null,
    isTracking: false,
    permissionGranted: false,
    error: null,
  });

  const locationService = useRef(new LocationService());
  const weatherService = useRef(new WeatherService());
  const notificationService = useRef(new NotificationService());
  const lastWeatherCheck = useRef<number>(0);

  useEffect(() => {
    initializeServices();
    return () => {
      locationService.current.stopTracking();
    };
  }, []);

  const initializeServices = async () => {
    try {
      // Request permissions
      const [locationPermission, notificationPermission] = await Promise.all([
        locationService.current.requestPermissions(),
        notificationService.current.requestPermissions(),
      ]);

      setState(prev => ({ 
        ...prev, 
        permissionGranted: locationPermission,
        error: !locationPermission ? 'Location permission denied' : null
      }));

      if (locationPermission) {
        // Get initial location
        const initialLocation = await locationService.current.getCurrentLocation();
        if (initialLocation) {
          handleLocationUpdate(initialLocation);
        }
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to initialize location services' 
      }));
    }
  };

  const handleLocationUpdate = async (location: LocationData) => {
    setState(prev => ({ ...prev, currentLocation: location }));

    // Check weather every 10 minutes
    const now = Date.now();
    if (now - lastWeatherCheck.current > 10 * 60 * 1000) {
      lastWeatherCheck.current = now;
      
      const weather = await weatherService.current.getWeather(
        location.latitude,
        location.longitude
      );
      
      if (weather) {
        setState(prev => ({ ...prev, weather }));
        
        // Send weather alerts for rain/storms
        if (weather.condition.toLowerCase().includes('rain') || 
            weather.condition.toLowerCase().includes('storm')) {
          try {
            await notificationService.current.sendWeatherAlert(
              `${weather.condition} detected`,
              'Current location'
            );
          } catch (error) {
            console.warn('Error sending weather alert:', error);
          }
        }
      }
    }
  };

  const startTracking = async () => {
    if (!state.permissionGranted) return;

    try {
      await locationService.current.startTracking(handleLocationUpdate);
      setState(prev => ({ ...prev, isTracking: true, error: null }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to start location tracking',
        isTracking: false 
      }));
    }
  };

  const stopTracking = () => {
    locationService.current.stopTracking();
    setState(prev => ({ ...prev, isTracking: false }));
  };

  const checkProximity = async (targetLat: number, targetLng: number, radiusMeters: number = 100) => {
    if (!state.currentLocation) return false;

    try {
      const distance = calculateDistance(
        state.currentLocation.latitude,
        state.currentLocation.longitude,
        targetLat,
        targetLng
      );

      if (distance <= radiusMeters) {
        await notificationService.current.sendLocationAlert(
          `You're within ${Math.round(distance)}m of your destination!`
        );
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Error checking proximity:', error);
      return false;
    }
  };

  return {
    ...state,
    startTracking,
    stopTracking,
    checkProximity,
  };
};

// Helper function to calculate distance between two coordinates
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};