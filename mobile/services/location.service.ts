import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export class LocationService {
  private watchId: Location.LocationSubscription | null = null;
  private callbacks: ((location: LocationData) => void)[] = [];

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<LocationData | null> {
    try {
      // Check if location services are enabled
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        throw new Error('Location services are disabled. Please enable them in device settings.');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || 0,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  async startTracking(callback: (location: LocationData) => void) {
    try {
      this.callbacks.push(callback);

      if (!this.watchId) {
        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
          throw new Error('Location services are disabled');
        }

        this.watchId = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          (location) => {
            const locationData: LocationData = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              accuracy: location.coords.accuracy || 0,
              timestamp: location.timestamp,
            };

            this.callbacks.forEach(cb => {
              try {
                cb(locationData);
              } catch (error) {
                console.error('Error in location callback:', error);
              }
            });
          }
        );
      }
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  }

  stopTracking() {
    try {
      if (this.watchId) {
        this.watchId.remove();
        this.watchId = null;
      }
      this.callbacks = [];
    } catch (error) {
      console.error('Error stopping location tracking:', error);
      // Force reset even if remove fails
      this.watchId = null;
      this.callbacks = [];
    }
  }
}