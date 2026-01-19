import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Cloud, Navigation, AlertCircle, Bell, BellOff } from 'react-native-feather';
import { colors, spacing, typography, borderRadius } from '../theme/colors';
import { useLocationTracking } from '../hooks/useLocationTracking';
import Constants from 'expo-constants';

interface LocationStatusProps {
  onToggleTracking?: () => void;
  showWeather?: boolean;
}

export const LocationStatus: React.FC<LocationStatusProps> = ({ 
  onToggleTracking, 
  showWeather = true 
}) => {
  const {
    currentLocation,
    weather,
    isTracking,
    permissionGranted,
    error,
    startTracking,
    stopTracking,
  } = useLocationTracking();

  const isExpoGo = Constants.appOwnership === 'expo';

  const handleToggleTracking = async () => {
    if (isTracking) {
      stopTracking();
    } else {
      await startTracking();
    }
    onToggleTracking?.();
  };

  if (!permissionGranted) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <AlertCircle width={20} height={20} color={colors.error} />
          <Text style={styles.errorText}>Location permission required</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Location Status */}
      <View style={styles.statusRow}>
        <View style={styles.statusItem}>
          <View style={[styles.statusIndicator, { 
            backgroundColor: isTracking ? colors.success : colors.textTertiary 
          }]} />
          <MapPin 
            width={16} 
            height={16} 
            color={isTracking ? colors.success : colors.textTertiary} 
          />
          <Text style={[styles.statusText, {
            color: isTracking ? colors.success : colors.textTertiary
          }]}>
            {isTracking ? 'Live Tracking' : 'Tracking Off'}
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.toggleButton, {
            backgroundColor: isTracking ? colors.error : colors.primary
          }]}
          onPress={handleToggleTracking}
        >
          <Text style={styles.toggleButtonText}>
            {isTracking ? 'Stop' : 'Start'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Current Location */}
      {currentLocation && (
        <View style={styles.locationInfo}>
          <Navigation width={14} height={14} color={colors.textSecondary} />
          <Text style={styles.locationText}>
            {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
          </Text>
          <Text style={styles.accuracyText}>
            ±{Math.round(currentLocation.accuracy)}m
          </Text>
        </View>
      )}

      {/* Weather Info */}
      {showWeather && weather && (
        <View style={styles.weatherContainer}>
          <Cloud width={16} height={16} color={colors.primary} />
          <Text style={styles.weatherText}>
            {weather.temperature}°C • {weather.description}
          </Text>
          {(weather.condition.toLowerCase().includes('rain') || 
            weather.condition.toLowerCase().includes('storm')) && (
            <View style={styles.weatherAlert}>
              <AlertCircle width={14} height={14} color={colors.warning} />
              <Text style={styles.weatherAlertText}>Weather Alert</Text>
            </View>
          )}
        </View>
      )}

      {/* Notification Status */}
      {isExpoGo && (
        <View style={styles.notificationStatus}>
          <BellOff width={14} height={14} color={colors.warning} />
          <Text style={styles.notificationStatusText}>
            Push notifications use alerts in Expo Go
          </Text>
        </View>
      )}

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle width={16} height={16} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  toggleButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  toggleButtonText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '600',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  locationText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  accuracyText: {
    ...typography.caption,
    color: colors.textTertiary,
    marginLeft: 'auto',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  weatherText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  weatherAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginLeft: 'auto',
    backgroundColor: colors.warning + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  weatherAlertText: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.error + '10',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
  },
  notificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.warning + '15',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  notificationStatusText: {
    ...typography.caption,
    color: colors.warning,
    flex: 1,
  },
});