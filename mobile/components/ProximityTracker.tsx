import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { MapPin, Bell, CheckCircle } from 'react-native-feather';
import { colors, spacing, typography, borderRadius } from '../theme/colors';
import { useLocationTracking } from '../hooks/useLocationTracking';

interface Destination {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'hotel' | 'restaurant' | 'attraction' | 'transport';
}

interface ProximityTrackerProps {
  destinations: Destination[];
  radiusMeters?: number;
}

export const ProximityTracker: React.FC<ProximityTrackerProps> = ({ 
  destinations, 
  radiusMeters = 100 
}) => {
  const { currentLocation, checkProximity } = useLocationTracking();
  const [proximityStatus, setProximityStatus] = useState<Record<string, {
    isNear: boolean;
    distance: number;
    notified: boolean;
  }>>({});

  useEffect(() => {
    if (!currentLocation || destinations.length === 0) return;

    const checkAllDestinations = async () => {
      const newStatus: typeof proximityStatus = {};

      for (const destination of destinations) {
        const distance = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          destination.latitude,
          destination.longitude
        );

        const isNear = distance <= radiusMeters;
        const wasNear = proximityStatus[destination.id]?.isNear || false;
        const wasNotified = proximityStatus[destination.id]?.notified || false;

        // Send notification if just entered proximity and not already notified
        if (isNear && !wasNear && !wasNotified) {
          await checkProximity(destination.latitude, destination.longitude, radiusMeters);
        }

        newStatus[destination.id] = {
          isNear,
          distance: Math.round(distance),
          notified: isNear ? true : wasNotified,
        };
      }

      setProximityStatus(newStatus);
    };

    checkAllDestinations();
  }, [currentLocation, destinations, radiusMeters]);

  const renderDestination = ({ item }: { item: Destination }) => {
    const status = proximityStatus[item.id];
    const isNear = status?.isNear || false;
    const distance = status?.distance || 0;

    return (
      <View style={[styles.destinationCard, {
        borderColor: isNear ? colors.success : colors.border,
        backgroundColor: isNear ? colors.success + '10' : colors.surface,
      }]}>
        <View style={styles.destinationHeader}>
          <View style={styles.destinationInfo}>
            <MapPin 
              width={16} 
              height={16} 
              color={isNear ? colors.success : colors.textSecondary} 
            />
            <Text style={[styles.destinationName, {
              color: isNear ? colors.success : colors.textPrimary
            }]}>
              {item.name}
            </Text>
          </View>
          
          {isNear ? (
            <View style={styles.nearIndicator}>
              <CheckCircle width={16} height={16} color={colors.success} />
              <Text style={styles.nearText}>Nearby</Text>
            </View>
          ) : (
            <Text style={styles.distanceText}>{distance}m away</Text>
          )}
        </View>

        <View style={styles.destinationMeta}>
          <Text style={styles.destinationType}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
          
          {status?.notified && (
            <View style={styles.notificationIndicator}>
              <Bell width={12} height={12} color={colors.primary} />
              <Text style={styles.notificationText}>Notified</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (!currentLocation) {
    return (
      <View style={styles.container}>
        <Text style={styles.noLocationText}>
          Enable location tracking to see proximity alerts
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Destinations</Text>
        <Text style={styles.subtitle}>
          You'll be notified when within {radiusMeters}m
        </Text>
      </View>

      <FlatList
        data={destinations}
        renderItem={renderDestination}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

// Helper function to calculate distance
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  noLocationText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.xl,
  },
  list: {
    gap: spacing.md,
  },
  destinationCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  destinationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  destinationName: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  nearIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.success + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  nearText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '600',
  },
  distanceText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  destinationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  destinationType: {
    ...typography.caption,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notificationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  notificationText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '500',
  },
});