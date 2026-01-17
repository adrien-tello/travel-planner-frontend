import React, { useEffect, useState } from "react"
import { View, StyleSheet, ActivityIndicator, Text } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { mapApi, ItineraryMapData } from "../api/map.api"
import { colors, spacing, typography } from "../theme/colors"

interface ItineraryMapProps {
  places: Array<{ name: string; city: string; type: string }>
}

export function ItineraryMap({ places }: ItineraryMapProps) {
  const [mapData, setMapData] = useState<ItineraryMapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMapData()
  }, [places])

  const loadMapData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await mapApi.getItineraryMap(places)
      setMapData(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load map')
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

  if (error || !mapData) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'No map data available'}</Text>
      </View>
    )
  }

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={{
        latitude: mapData.center.lat,
        longitude: mapData.center.lng,
        latitudeDelta: Math.abs(mapData.bounds.northeast.lat - mapData.bounds.southwest.lat) * 1.5,
        longitudeDelta: Math.abs(mapData.bounds.northeast.lng - mapData.bounds.southwest.lng) * 1.5,
      }}
    >
      {mapData.locations.map((location, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={location.name}
          description={location.address}
        />
      ))}
    </MapView>
  )
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
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
})
