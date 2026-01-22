import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Mapbox from '../services/mapbox.config';
import { colors, borderRadius } from '../theme/colors';
import { useItineraryMap } from '../api/tripadvisor.api';

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'hotel' | 'restaurant' | 'attraction' | 'transport';
}

interface TripMapProps {
  locations?: Location[];
  itineraryId?: string;
  centerCoordinate?: [number, number];
  showUserLocation?: boolean;
  style?: any;
}

const { width, height } = Dimensions.get('window');

export const TripMap: React.FC<TripMapProps> = ({
  locations = [],
  itineraryId,
  centerCoordinate,
  showUserLocation = true,
  style,
}) => {
  const cameraRef = useRef<Mapbox.Camera>(null);
  
  // Fetch itinerary map data if itineraryId is provided
  const { data: mapData } = useItineraryMap(itineraryId || '');

  // Use either provided locations or fetched map data
  const displayLocations = mapData?.markers || locations;
  const displayCenter = mapData?.center || centerCoordinate || [0, 0];
  const displayRoutes = mapData?.routes || [];

  useEffect(() => {
    if (locations?.length > 0 && cameraRef.current) {
      // Fit camera to show all locations
      const coordinates = locations.map(loc => [loc.longitude, loc.latitude]);
      cameraRef.current.fitBounds(
        coordinates[0], // northEast
        coordinates[coordinates.length - 1], // southWest
        [50, 50, 50, 50], // padding
        1000 // animationDuration
      );
    }
  }, [locations]);

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'hotel': return colors.primary;
      case 'restaurant': return colors.secondary;
      case 'attraction': return colors.accent1;
      case 'transport': return colors.accent2;
      default: return colors.primary;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Mapbox.MapView
        style={styles.map}
        styleURL="mapbox://styles/mapbox/streets-v12"
      >
        <Mapbox.Camera
          ref={cameraRef}
          centerCoordinate={centerCoordinate || [0, 0]}
          zoomLevel={12}
          animationDuration={1000}
        />

        {showUserLocation && (
          <Mapbox.UserLocation visible={true} />
        )}

        {locations?.map((location, index) => (
          <Mapbox.PointAnnotation
            key={location.id}
            id={location.id}
            coordinate={[location.longitude, location.latitude]}
          >
            <View style={[styles.marker, { backgroundColor: getMarkerColor(location.type) }]}>
              <View style={styles.markerInner}>
                <View style={styles.markerText}>
                  {/* You can add icons here based on type */}
                </View>
              </View>
            </View>
          </Mapbox.PointAnnotation>
        ))}

        {/* Draw route line between locations */}
        {locations?.length > 1 && (
          <Mapbox.ShapeSource
            id="routeSource"
            shape={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: locations?.map(loc => [loc.longitude, loc.latitude]) || [],
              },
            }}
          >
            <Mapbox.LineLayer
              id="routeLine"
              style={{
                lineColor: colors.primary,
                lineWidth: 3,
                lineOpacity: 0.7,
              }}
            />
          </Mapbox.ShapeSource>
        )}
      </Mapbox.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  markerInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerText: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});