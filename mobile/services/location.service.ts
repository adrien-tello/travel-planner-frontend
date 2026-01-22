import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  address?: string;
}

export class LocationService {
  static async requestPermissions(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  static async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      
      // Reverse geocoding to get city and country
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const address = reverseGeocode[0];
      
      return {
        latitude,
        longitude,
        city: address?.city || address?.region || 'Unknown',
        country: address?.country || 'Unknown',
        address: `${address?.street || ''} ${address?.name || ''}`.trim() || 'Unknown location'
      };
    } catch (error) {
      console.error('Location error:', error);
      return null;
    }
  }

  static async watchLocation(callback: (location: LocationData | null) => void): Promise<Location.LocationSubscription | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      return await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 50, // Update every 50 meters
        },
        async (location) => {
          const { latitude, longitude } = location.coords;
          
          const reverseGeocode = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });

          const address = reverseGeocode[0];
          
          callback({
            latitude,
            longitude,
            city: address?.city || address?.region || 'Unknown',
            country: address?.country || 'Unknown',
            address: `${address?.street || ''} ${address?.name || ''}`.trim() || 'Unknown location'
          });
        }
      );
    } catch (error) {
      console.error('Location watch error:', error);
      callback(null);
      return null;
    }
  }
}