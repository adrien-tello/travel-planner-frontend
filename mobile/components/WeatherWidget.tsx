import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Cloud, Wind, Droplet, Thermometer } from 'react-native-feather';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/colors';
import { WeatherService, WeatherData } from '../services/weather.service';

interface WeatherWidgetProps {
  style?: any;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ style }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    try {
      const weatherData = await WeatherService.getInstance().getCurrentWeather();
      setWeather(weatherData);
    } catch (error) {
      console.error('Failed to load weather:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !weather) {
    return (
      <View style={[styles.container, style]}>
        <LinearGradient
          colors={['#4A90E2', '#7B68EE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.loadingText}>Loading weather...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <TouchableOpacity style={[styles.container, style]} activeOpacity={0.8} onPress={loadWeather}>
      <LinearGradient
        colors={getWeatherGradient(weather.condition)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <Text style={styles.location}>{weather.location}</Text>
            <Text style={styles.condition}>{weather.condition}</Text>
          </View>
          <Text style={styles.weatherIcon}>{weather.icon}</Text>
        </View>

        <View style={styles.temperatureContainer}>
          <Text style={styles.temperature}>{weather.temperature}°</Text>
          <Text style={styles.feelsLike}>Feels like {weather.feelsLike}°</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Droplet width={16} height={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.detailText}>{weather.humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Wind width={16} height={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.detailText}>{weather.windSpeed} km/h</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const getWeatherGradient = (condition: string): [string, string] => {
  switch (condition.toLowerCase()) {
    case 'sunny':
      return ['#FFD700', '#FFA500'];
    case 'cloudy':
      return ['#708090', '#4682B4'];
    case 'partly cloudy':
      return ['#87CEEB', '#4169E1'];
    case 'rainy':
      return ['#4682B4', '#2F4F4F'];
    default:
      return ['#4A90E2', '#7B68EE'];
  }
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  gradient: {
    padding: spacing.lg,
    minHeight: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  locationContainer: {
    flex: 1,
  },
  location: {
    ...(typography.h4 as TextStyle),
    color: colors.white,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  condition: {
    ...(typography.body as TextStyle),
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  weatherIcon: {
    fontSize: 32,
    marginLeft: spacing.md,
  },
  temperatureContainer: {
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '300',
    color: colors.white,
    lineHeight: 52,
  },
  feelsLike: {
    ...(typography.caption as TextStyle),
    color: 'rgba(255,255,255,0.8)',
    marginTop: -spacing.xs,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    ...(typography.bodySmall as TextStyle),
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  loadingText: {
    ...(typography.body as TextStyle),
    color: colors.white,
    textAlign: 'center',
  },
});