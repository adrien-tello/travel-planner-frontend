import React from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  TextStyle,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MapPin, Star, DollarSign, Clock, Users } from "react-native-feather"
import { LinearGradient } from "expo-linear-gradient"
import { colors, spacing, typography, borderRadius, shadows } from "../../theme/colors"
import { TripMap } from "../../components/TripMap"
import { GlassmorphicCard } from "../../components/GlassmorphicCard"
import { GradientButton } from "../../components/GradientButton"

export default function DestinationDetailScreen({ route, navigation }: any) {
  const { destination } = route.params || {}
  
  const mockData = {
    name: destination?.name || "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1499621574732-72324384dfbc?w=800",
    rating: 4.8,
    description: "The City of Light beckons with its magnificent art, architecture, culture, and cuisine. From the iconic Eiffel Tower to charming cobblestone streets, Paris offers an unforgettable experience.",
    highlights: [
      "Eiffel Tower & Champs-Élysées",
      "Louvre Museum & Art Galleries",
      "Notre-Dame & Historic Churches",
      "Seine River Cruises",
      "French Cuisine & Cafés"
    ],
    bestTime: "April to June, September to October",
    averageCost: "$150-300/day",
    travelTime: "7-10 days ideal",
    weather: "Mild, occasional rain",
    topHotels: [
      {
        id: "1",
        name: "Le Grand Paris",
        rating: 4.7,
        pricePerNight: 250,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
        location: { latitude: 48.8566, longitude: 2.3522 },
        amenities: ["Free WiFi", "Pool", "Gym", "Restaurant"],
        description: "Luxury hotel in the heart of Paris with stunning views"
      },
      {
        id: "2",
        name: "Boutique Montmartre",
        rating: 4.5,
        pricePerNight: 180,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
        location: { latitude: 48.8867, longitude: 2.3431 },
        amenities: ["Free WiFi", "Breakfast", "Spa"],
        description: "Charming boutique hotel with personalized service"
      }
    ],
    topRestaurants: [
      {
        id: "1",
        name: "Le Petit Bistro",
        cuisine: "French",
        rating: 4.6,
        priceRange: "$$",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
        location: { latitude: 48.8606, longitude: 2.3376 },
        description: "Authentic French cuisine in a cozy setting"
      }
    ],
    activities: [
      {
        id: "1",
        name: "Louvre Museum Tour",
        category: "Culture",
        rating: 4.9,
        price: 45,
        duration: "3-4 hours",
        image: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3c6?w=400",
        location: { latitude: 48.8606, longitude: 2.3376 },
        description: "Guided tour of world's largest art museum"
      }
    ]
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <ImageBackground
          source={{ uri: mockData.image }}
          style={styles.heroImage}
          imageStyle={styles.heroImageStyle}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.locationBadge}>
                <MapPin width={16} height={16} color={colors.white} strokeWidth={2} />
                <Text style={styles.locationText}>{mockData.country}</Text>
              </View>
              <Text style={styles.heroTitle}>{mockData.name}</Text>
              <View style={styles.ratingContainer}>
                <Star width={20} height={20} color={colors.accent3} fill={colors.accent3} strokeWidth={0} />
                <Text style={styles.ratingText}>{mockData.rating} • Highly Rated</Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.content}>
          {/* Quick Info Cards */}
          <View style={styles.quickInfoGrid}>
            <GlassmorphicCard style={styles.quickInfoCard}>
              <DollarSign width={24} height={24} color={colors.primary} strokeWidth={2} />
              <Text style={styles.quickInfoLabel}>Daily Budget</Text>
              <Text style={styles.quickInfoValue}>{mockData.averageCost}</Text>
            </GlassmorphicCard>
            
            <GlassmorphicCard style={styles.quickInfoCard}>
              <Clock width={24} height={24} color={colors.secondary} strokeWidth={2} />
              <Text style={styles.quickInfoLabel}>Best Duration</Text>
              <Text style={styles.quickInfoValue}>{mockData.travelTime}</Text>
            </GlassmorphicCard>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About {mockData.name}</Text>
            <Text style={styles.description}>{mockData.description}</Text>
          </View>

          {/* Highlights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Must-See Highlights ✨</Text>
            {mockData.highlights.map((highlight, index) => (
              <View key={index} style={styles.highlightItem}>
                <View style={styles.highlightDot} />
                <Text style={styles.highlightText}>{highlight}</Text>
              </View>
            ))}
          </View>

          {/* Map */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location & Nearby Places 📍</Text>
            <TripMap
              locations={[
                ...mockData.topHotels.map(hotel => ({
                  id: hotel.id,
                  name: hotel.name,
                  latitude: hotel.location.latitude,
                  longitude: hotel.location.longitude,
                  type: 'hotel' as const
                })),
                ...mockData.topRestaurants.map(restaurant => ({
                  id: restaurant.id,
                  name: restaurant.name,
                  latitude: restaurant.location.latitude,
                  longitude: restaurant.location.longitude,
                  type: 'restaurant' as const
                })),
                ...mockData.activities.map(activity => ({
                  id: activity.id,
                  name: activity.name,
                  latitude: activity.location.latitude,
                  longitude: activity.location.longitude,
                  type: 'attraction' as const
                }))
              ]}
              centerCoordinate={[2.3522, 48.8566]}
            />
            
            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                <Text style={styles.legendText}>Hotels</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.secondary }]} />
                <Text style={styles.legendText}>Restaurants</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.accent3 }]} />
                <Text style={styles.legendText}>Activities</Text>
              </View>
            </View>
          </View>

          {/* Top Hotels */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommended Hotels 🏨</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {mockData.topHotels.map((hotel) => (
                <View key={hotel.id} style={styles.hotelCard}>
                  <ImageBackground
                    source={{ uri: hotel.image }}
                    style={styles.hotelImage}
                    imageStyle={styles.hotelImageStyle}
                  >
                    <View style={styles.hotelRating}>
                      <Star width={12} height={12} color={colors.white} fill={colors.white} strokeWidth={0} />
                      <Text style={styles.hotelRatingText}>{hotel.rating}</Text>
                    </View>
                  </ImageBackground>
                  <View style={styles.hotelInfo}>
                    <Text style={styles.hotelName}>{hotel.name}</Text>
                    <Text style={styles.hotelPrice}>${hotel.pricePerNight}/night</Text>
                  </View>
                </View>
              ))}
              <View style={{ height: 100 }} />
            </ScrollView>
          </View>

          {/* CTA Button */}
          <GradientButton
            title="Plan Trip with AI ✨"
            onPress={() => navigation.navigate("HomeStack", {
              screen: "CreateItinerary",
              params: { destination: mockData.name }
            })}
            gradient={colors.gradientPurple}
            style={styles.ctaButton}
          />
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroImage: {
    width: "100%",
    height: 350,
  },
  heroImageStyle: {
    resizeMode: "cover",
  },
  heroGradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: spacing.xl,
  },
  heroContent: {
    gap: spacing.sm,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: "flex-start",
  },
  locationText: {
    ...(typography.caption as TextStyle),
    color: colors.white,
    fontWeight: "600",
  },
  heroTitle: {
    ...(typography.h1 as TextStyle),
    color: colors.white,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  ratingText: {
    ...(typography.body as TextStyle),
    color: colors.white,
    fontWeight: "600",
  },
  content: {
    padding: spacing.xl,
  },
  quickInfoGrid: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  quickInfoCard: {
    flex: 1,
    alignItems: "center",
    gap: spacing.sm,
  },
  quickInfoLabel: {
    ...(typography.caption as TextStyle),
    color: colors.textSecondary,
    textAlign: "center",
  },
  quickInfoValue: {
    ...(typography.bodyMedium as TextStyle),
    color: colors.textPrimary,
    fontWeight: "700",
    textAlign: "center",
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...(typography.h3 as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  description: {
    ...(typography.body as TextStyle),
    color: colors.textSecondary,
    lineHeight: 24,
  },
  highlightItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  highlightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  highlightText: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    flex: 1,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    ...(typography.caption as TextStyle),
    color: colors.textSecondary,
  },
  hotelCard: {
    width: 200,
    marginRight: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.md,
  },
  hotelImage: {
    width: "100%",
    height: 120,
    justifyContent: "flex-end",
    padding: spacing.sm,
  },
  hotelImageStyle: {
    resizeMode: "cover",
  },
  hotelRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: "flex-start",
  },
  hotelRatingText: {
    ...(typography.caption as TextStyle),
    color: colors.white,
    fontWeight: "700",
  },
  hotelInfo: {
    padding: spacing.md,
  },
  hotelName: {
    ...(typography.bodyMedium as TextStyle),
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  hotelPrice: {
    ...(typography.bodySmall as TextStyle),
    color: colors.primary,
    fontWeight: "700",
  },
  ctaButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
})