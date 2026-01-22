import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { LocationService, LocationData } from '../services/location.service';
import { WeatherService, WeatherData } from '../services/weather.service';
import { NotificationService } from '../services/notification.service';
import { colors, spacing, typography } from '../theme/colors';

interface LiveItineraryProps {
  itinerary: any;
  currentDay: number;
}

export function LiveItinerary({ itinerary, currentDay }: LiveItineraryProps) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);
  const weatherService = WeatherService.getInstance();
  const notificationService = new NotificationService();

  useEffect(() => {
    initializeServices();
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (location) {
      updateWeather();
      checkProximityToDestinations();
    }
  }, [location]);

  const initializeServices = async () => {
    const locationPermission = await LocationService.requestPermissions();
    const notificationPermission = await notificationService.requestPermissions();

    if (!locationPermission) {
      Alert.alert('Location Permission', 'Location access is required for live tracking');
      return;
    }

    const subscription = await LocationService.watchLocation((newLocation) => {
      setLocation(newLocation);
    });
    
    if (subscription) {
      setLocationSubscription(subscription);
    }

    const currentLocation = await LocationService.getCurrentLocation();
    if (currentLocation) {
      setLocation(currentLocation);
    }
  };

  const updateWeather = async () => {
    if (!location) return;

    try {
      const weatherData = await weatherService.getCurrentWeather();
      if (weatherData) {
        setWeather(weatherData);

        if (weatherData.condition === 'Rainy' || weatherData.condition === 'Cloudy') {
          notificationService.sendWeatherAlert(
            `${weatherData.condition} expected`,
            'Current location'
          );
        }
      }
    } catch (error) {
      console.error('Weather update error:', error);
    }
  };

  const checkProximityToDestinations = () => {
    if (!location || !itinerary?.days?.[currentDay - 1]) return;

    const currentDayData = itinerary.days[currentDay - 1];
    const allPlaces = [
      ...(currentDayData.hotels || []),
      ...(currentDayData.restaurants || []),
      ...(currentDayData.activities || [])
    ];

    allPlaces.forEach((place: any) => {
      if (place.details?.latitude && place.details?.longitude) {
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          place.details.latitude,
          place.details.longitude
        );

        // Notify when within 100 meters of destination
        if (distance < 0.1) {
          notificationService.sendLocationAlert(
            `You're near ${place.name}! Check your itinerary for details.`
          );
        }
      }
    });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <View style={styles.container}>
      {/* Live Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Location</Text>
          <Text style={styles.statusValue}>
            {location ? '📍 Live' : '📍 Searching...'}
          </Text>
        </View>

        {weather && (
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Weather</Text>
            <Text style={styles.statusValue}>
              {weather.temperature}°C {weather.condition}
            </Text>
          </View>
        )}

        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Day</Text>
          <Text style={styles.statusValue}>{currentDay}</Text>
        </View>
      </View>

      {/* Current Location Info */}
      {location && (
        <View style={styles.locationCard}>
          <Text style={styles.cardTitle}>Current Location</Text>
          <Text style={styles.coordinates}>
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
          <Text style={styles.address}>
            {location.address || 'Address not available'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    ...typography.caption,
    color: colors.white,
    opacity: 0.8,
  },
  statusValue: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '600',
  },
  locationCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  coordinates: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  address: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
});