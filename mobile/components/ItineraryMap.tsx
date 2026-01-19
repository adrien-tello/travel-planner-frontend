import React, { useEffect, useState, useRef } from "react"
import { View, StyleSheet, ActivityIndicator, Text } from "react-native"
import Mapbox from "../services/mapbox.config"
import { mapApi, ItineraryMapData } from "../api/map.api"
import { colors, spacing, typography } from "../theme/colors"

interface ItineraryMapProps {
  places: Array<{ name: string; city: string; type: string }>
}

export function ItineraryMap({ places }: ItineraryMapProps) {
  const [mapData, setMapData] = useState<ItineraryMapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const cameraRef = useRef<Mapbox.Camera>(null)

  useEffect(() => {
    loadMapData()
  }, [places])

  const loadMapData = async () => {
    try {
      if (!places || places.length === 0) {
        console.log('❌ No places provided')
        setError('No places to display on map')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      console.log('🗺️ Loading map for places:', places)
      const data = await mapApi.getItineraryMap(places)
      console.log('📍 Map data received:', data)
      
      if (!data) {
        setError('No map data returned from API')
        setLoading(false)
        return
      }
      
      if (!data.locations || data.locations.length === 0) {
        setError('No locations found in map data')
        setLoading(false)
        return
      }
      
      setMapData(data)
    } catch (err: any) {
      console.error('❌ Map Error:', err.response?.data || err.message || err)
      setError(err.response?.data?.message || err.message || 'Failed to load map')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    )
  }

  if (error && !mapData) {
    // Show fallback map with default location
    return (
      <View style={styles.container}>
        <Mapbox.MapView
          style={styles.map}
          styleURL="mapbox://styles/mapbox/streets-v12"
          centerCoordinate={[0, 20]} // Default center
        >
          <Mapbox.Camera
            ref={cameraRef}
            centerCoordinate={[0, 20]}
            zoomLevel={2}
            animationDuration={1000}
          />
        </Mapbox.MapView>
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      </View>
    )
  }

  const centerLat = mapData.center.lat
  const centerLng = mapData.center.lng

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        style={styles.map}
        styleURL="mapbox://styles/mapbox/streets-v12"
        centerCoordinate={[centerLng, centerLat]}
      >
        <Mapbox.Camera
          ref={cameraRef}
          centerCoordinate={[centerLng, centerLat]}
          zoomLevel={10}
          animationDuration={1000}
        />

        {mapData.locations?.map((location, index) => (
          <Mapbox.PointAnnotation
            key={index}
            id={`location-${index}`}
            coordinate={[location.longitude, location.latitude]}
          >
            <View style={[styles.marker, { backgroundColor: colors.primary }]}>
              <Text style={styles.markerText}>{index + 1}</Text>
            </View>
          </Mapbox.PointAnnotation>
        ))}
      </Mapbox.MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  markerText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: colors.error,
    padding: spacing.md,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  errorBannerText: {
    color: colors.white,
    fontSize: typography.small.fontSize,
    textAlign: 'center',
  },
})
