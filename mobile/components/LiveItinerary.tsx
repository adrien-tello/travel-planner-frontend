import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
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
  const [locationService] = useState(new LocationService());
  const [weatherService] = useState(new WeatherService());
  const [notificationService] = useState(new NotificationService());

  useEffect(() => {
    initializeServices();
    return () => {
      locationService.stopTracking();
    };
  }, []);

  useEffect(() => {
    if (location) {
      updateWeather();
      checkProximityToDestinations();
    }
  }, [location]);

  const initializeServices = async () => {
    // Request permissions
    const locationPermission = await locationService.requestPermissions();
    const notificationPermission = await notificationService.requestPermissions();

    if (!locationPermission) {
      Alert.alert('Location Permission', 'Location access is required for live tracking');
      return;
    }

    // Start location tracking
    locationService.startTracking((newLocation) => {
      setLocation(newLocation);
    });

    // Get initial location
    const currentLocation = await locationService.getCurrentLocation();
    if (currentLocation) {
      setLocation(currentLocation);
    }
  };

  const updateWeather = async () => {
    if (!location) return;

    const weatherData = await weatherService.getWeather(location.latitude, location.longitude);
    if (weatherData) {
      setWeather(weatherData);

      // Send weather alerts for extreme conditions
      if (weatherData.condition === 'Rain' || weatherData.condition === 'Storm') {
        notificationService.sendWeatherAlert(
          `${weatherData.condition} expected`,
          'Current location'
        );
      }
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
          <Text style={styles.accuracy}>
            Accuracy: ±{Math.round(location.accuracy)}m
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
  accuracy: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
});