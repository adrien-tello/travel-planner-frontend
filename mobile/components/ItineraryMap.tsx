import React from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { colors, borderRadius, spacing, typography } from "../theme/colors";
import { MapData, Hotel, Activity } from "../api/itinerary.api";

interface ItineraryMapProps {
  mapData?: MapData;
  hotels?: Hotel[];
  activities?: Activity[];
  destination: string;
}

export const ItineraryMap: React.FC<ItineraryMapProps> = ({
  mapData,
  hotels = [],
  activities = [],
  destination,
}) => {
  const initialRegion = mapData ? {
    latitude: mapData.latitude,
    longitude: mapData.longitude,
    latitudeDelta: Math.abs(mapData.bounds.northeast.lat - mapData.bounds.southwest.lat),
    longitudeDelta: Math.abs(mapData.bounds.northeast.lng - mapData.bounds.southwest.lng),
  } : {
    latitude: 40.7128,
    longitude: -74.0060,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 {destination} Map</Text>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* Hotel Markers */}
        {hotels.map((hotel, index) => (
          <Marker
            key={`hotel-${index}`}
            coordinate={{
              latitude: mapData?.latitude || initialRegion.latitude,
              longitude: mapData?.longitude || initialRegion.longitude,
            }}
            title={hotel.name}
            description={`🏨 $${hotel.pricePerNight}/night • ${hotel.rating}⭐`}
            pinColor={colors.primary}
          />
        ))}

        {/* Activity Markers */}
        {activities.map((activity, index) => (
          <Marker
            key={`activity-${index}`}
            coordinate={{
              latitude: mapData?.latitude || initialRegion.latitude + (index * 0.01),
              longitude: mapData?.longitude || initialRegion.longitude + (index * 0.01),
            }}
            title={activity.name}
            description={`🎯 ${activity.type} • $${activity.cost}`}
            pinColor={colors.secondary}
          />
        ))}

        {/* Destination Center Marker */}
        {mapData && (
          <Marker
            coordinate={{
              latitude: mapData.latitude,
              longitude: mapData.longitude,
            }}
            title={destination}
            description="📍 Destination Center"
            pinColor={colors.accent3}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
    padding: spacing.md,
    backgroundColor: colors.surface,
    textAlign: "center",
  },
  map: {
    width: "100%",
    height: 250,
  },
});