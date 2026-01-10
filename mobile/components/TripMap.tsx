import React from "react"
import { StyleSheet, View, Dimensions } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { Hotel, Restaurant, Leisure } from "../store/tripPlannerStore"
import { colors, borderRadius } from "../theme/colors"

interface TripMapProps {
  hotels?: Hotel[]
  restaurants?: Restaurant[]
  leisureActivities?: Leisure[]
  initialRegion?: {
    latitude: number
    longitude: number
    latitudeDelta: number
    longitudeDelta: number
  }
}

export const TripMap: React.FC<TripMapProps> = ({
  hotels = [],
  restaurants = [],
  leisureActivities = [],
  initialRegion = {
    latitude: 40.7128,
    longitude: -74.0060,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
}) => {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
      >
        {/* Hotel Markers */}
        {hotels.map((hotel) => (
          <Marker
            key={`hotel-${hotel.id}`}
            coordinate={hotel.location}
            title={hotel.name}
            description={`$${hotel.pricePerNight}/night • ${hotel.rating}⭐`}
            pinColor={colors.primary}
          />
        ))}

        {/* Restaurant Markers */}
        {restaurants.map((restaurant) => (
          <Marker
            key={`restaurant-${restaurant.id}`}
            coordinate={restaurant.location}
            title={restaurant.name}
            description={`${restaurant.cuisine} • ${restaurant.priceRange}`}
            pinColor={colors.secondary}
          />
        ))}

        {/* Leisure Activity Markers */}
        {leisureActivities.map((activity) => (
          <Marker
            key={`leisure-${activity.id}`}
            coordinate={activity.location}
            title={activity.name}
            description={`${activity.category} • $${activity.price}`}
            pinColor={colors.accent3}
          />
        ))}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: 300,
  },
})