import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextStyle,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin, Calendar, DollarSign, Clock, Star, ChevronRight } from "react-native-feather"
import { LinearGradient } from "expo-linear-gradient"
import { colors, spacing, typography, borderRadius, shadows } from "../../theme/colors"
import { TripMap } from "../../components/TripMap"
import { PersonalizationIndicator } from "../../components/PersonalizationIndicator"
import { GlassmorphicCard } from "../../components/GlassmorphicCard"
import { useTripPlannerStore } from "../../store/tripPlannerStore"

export default function TripPlanDetailScreen({ route }: any) {
  const { currentPlan } = useTripPlannerStore()
  const [selectedTab, setSelectedTab] = useState<"overview" | "hotels" | "dining" | "activities">("overview")

  if (!currentPlan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No trip plan available</Text>
        </View>
      </SafeAreaView>
    )
  }

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* AI Suggestions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Recommendations ✨</Text>
        {currentPlan.aiSuggestions.map((suggestion, index) => (
          <View key={index} style={styles.suggestionCard}>
            <View style={styles.suggestionDot} />
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </View>
        ))}
      </View>

      {/* Personalization Score */}
      <View style={styles.section}>
        <PersonalizationIndicator 
          score={currentPlan.personalizationScore}
          label="Trip Personalization Score"
        />
      </View>

      {/* Map Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location Overview 📍</Text>
        <TripMap
          locations={[
            ...currentPlan.hotels.map((hotel, index) => ({
              id: hotel.id,
              name: hotel.name,
              latitude: 40.7128 + (index * 0.01), // Mock coordinates
              longitude: -74.0060 + (index * 0.01),
              type: 'hotel' as const,
            })),
            ...currentPlan.restaurants.map((restaurant, index) => ({
              id: restaurant.id,
              name: restaurant.name,
              latitude: 40.7128 + (index * 0.01) + 0.005,
              longitude: -74.0060 + (index * 0.01) + 0.005,
              type: 'restaurant' as const,
            })),
            ...currentPlan.leisureActivities.map((activity, index) => ({
              id: activity.id,
              name: activity.name,
              latitude: 40.7128 + (index * 0.01) + 0.01,
              longitude: -74.0060 + (index * 0.01) + 0.01,
              type: 'attraction' as const,
            })),
          ]}
        />
      </View>

      {/* Budget Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estimated Budget 💰</Text>
        <GlassmorphicCard>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Total Estimated</Text>
            <Text style={styles.budgetValue}>${currentPlan.estimatedBudget}</Text>
          </View>
          <View style={styles.budgetBar}>
            <View style={[styles.budgetSegment, { flex: 2, backgroundColor: colors.primary }]}>
              <Text style={styles.budgetSegmentText}>Accommodation</Text>
            </View>
            <View style={[styles.budgetSegment, { flex: 1.5, backgroundColor: colors.secondary }]}>
              <Text style={styles.budgetSegmentText}>Dining</Text>
            </View>
            <View style={[styles.budgetSegment, { flex: 1, backgroundColor: colors.accent3 }]}>
              <Text style={styles.budgetSegmentText}>Activities</Text>
            </View>
          </View>
        </GlassmorphicCard>
      </View>
    </View>
  )

  const renderHotels = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Recommended Hotels 🏨</Text>
      {currentPlan.hotels.map((hotel) => (
        <TouchableOpacity key={hotel.id} style={styles.placeCard}>
          <ImageBackground
            source={{ uri: hotel.image }}
            style={styles.placeImage}
            imageStyle={styles.placeImageStyle}
          >
            <View style={styles.placeRating}>
              <Star width={14} height={14} color={colors.white} fill={colors.white} strokeWidth={0} />
              <Text style={styles.placeRatingText}>{hotel.rating}</Text>
            </View>
          </ImageBackground>
          <View style={styles.placeInfo}>
            <Text style={styles.placeName}>{hotel.name}</Text>
            <Text style={styles.placeDescription}>{hotel.description}</Text>
            <View style={styles.placeDetails}>
              <DollarSign width={16} height={16} color={colors.primary} strokeWidth={2} />
              <Text style={styles.placePrice}>${hotel.pricePerNight}/night</Text>
            </View>
            <View style={styles.amenitiesContainer}>
              {hotel.amenities.slice(0, 3).map((amenity, index) => (
                <View key={index} style={styles.amenityChip}>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )

  const renderDining = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Recommended Restaurants 🍽️</Text>
      {currentPlan.restaurants.map((restaurant) => (
        <TouchableOpacity key={restaurant.id} style={styles.placeCard}>
          <ImageBackground
            source={{ uri: restaurant.image }}
            style={styles.placeImage}
            imageStyle={styles.placeImageStyle}
          >
            <View style={styles.placeRating}>
              <Star width={14} height={14} color={colors.white} fill={colors.white} strokeWidth={0} />
              <Text style={styles.placeRatingText}>{restaurant.rating}</Text>
            </View>
          </ImageBackground>
          <View style={styles.placeInfo}>
            <Text style={styles.placeName}>{restaurant.name}</Text>
            <Text style={styles.placeDescription}>{restaurant.description}</Text>
            <View style={styles.placeDetails}>
              <Text style={styles.placeCuisine}>{restaurant.cuisine}</Text>
              <Text style={styles.placeSeparator}>•</Text>
              <Text style={styles.placePrice}>{restaurant.priceRange}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )

  const renderActivities = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Leisure Activities 🎯</Text>
      {currentPlan.leisureActivities.map((activity) => (
        <TouchableOpacity key={activity.id} style={styles.placeCard}>
          <ImageBackground
            source={{ uri: activity.image }}
            style={styles.placeImage}
            imageStyle={styles.placeImageStyle}
          >
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{activity.category}</Text>
            </View>
          </ImageBackground>
          <View style={styles.placeInfo}>
            <Text style={styles.placeName}>{activity.name}</Text>
            <Text style={styles.placeDescription}>{activity.description}</Text>
            <View style={styles.activityDetails}>
              <View style={styles.activityDetail}>
                <DollarSign width={16} height={16} color={colors.primary} strokeWidth={2} />
                <Text style={styles.activityDetailText}>${activity.price}</Text>
              </View>
              <View style={styles.activityDetail}>
                <Clock width={16} height={16} color={colors.secondary} strokeWidth={2} />
                <Text style={styles.activityDetailText}>{activity.duration}</Text>
              </View>
              <View style={styles.activityDetail}>
                <Star width={16} height={16} color={colors.accent3} fill={colors.accent3} strokeWidth={0} />
                <Text style={styles.activityDetailText}>{activity.rating}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={colors.gradientTravel}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.destination}>{currentPlan.destination}</Text>
        <View style={styles.headerDetails}>
          <View style={styles.headerDetail}>
            <Calendar width={16} height={16} color={colors.white} strokeWidth={2} />
            <Text style={styles.headerDetailText}>{currentPlan.startDate} - {currentPlan.endDate}</Text>
          </View>
          <View style={styles.headerDetail}>
            <DollarSign width={16} height={16} color={colors.white} strokeWidth={2} />
            <Text style={styles.headerDetailText}>${currentPlan.estimatedBudget}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: "overview", label: "Overview", icon: "📋" },
            { key: "hotels", label: "Hotels", icon: "🏨" },
            { key: "dining", label: "Dining", icon: "🍽️" },
            { key: "activities", label: "Activities", icon: "🎯" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, selectedTab === tab.key && styles.tabActive]}
              onPress={() => setSelectedTab(tab.key as any)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, selectedTab === tab.key && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === "overview" && renderOverview()}
        {selectedTab === "hotels" && renderHotels()}
        {selectedTab === "dining" && renderDining()}
        {selectedTab === "activities" && renderActivities()}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  destination: {
    ...(typography.h1 as TextStyle),
    color: colors.white,
    marginBottom: spacing.md,
  },
  headerDetails: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  headerDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  headerDetailText: {
    ...(typography.bodySmall as TextStyle),
    color: "rgba(255, 255, 255, 0.95)",
    fontWeight: "600",
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    ...(typography.body as TextStyle),
    color: colors.textSecondary,
    fontWeight: "600",
  },
  tabLabelActive: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...(typography.h3 as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  suggestionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.primaryLight + "10",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    marginBottom: spacing.sm,
  },
  suggestionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: spacing.sm,
  },
  suggestionText: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    flex: 1,
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  budgetLabel: {
    ...(typography.h4 as TextStyle),
    color: colors.textPrimary,
  },
  budgetValue: {
    ...(typography.h2 as TextStyle),
    color: colors.primary,
    fontWeight: "700",
  },
  budgetBar: {
    flexDirection: "row",
    height: 60,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    gap: 2,
  },
  budgetSegment: {
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.sm,
  },
  budgetSegmentText: {
    ...(typography.caption as TextStyle),
    color: colors.white,
    fontWeight: "700",
    textAlign: "center",
  },
  placeCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: "hidden",
    ...shadows.md,
  },
  placeImage: {
    width: "100%",
    height: 160,
    justifyContent: "flex-end",
    padding: spacing.md,
  },
  placeImageStyle: {
    resizeMode: "cover",
  },
  placeRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: "flex-start",
  },
  placeRatingText: {
    ...(typography.caption as TextStyle),
    color: colors.white,
    fontWeight: "700",
  },
  categoryBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: "flex-start",
  },
  categoryText: {
    ...(typography.caption as TextStyle),
    color: colors.white,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  placeInfo: {
    padding: spacing.lg,
  },
  placeName: {
    ...(typography.h4 as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  placeDescription: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  placeDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  placePrice: {
    ...(typography.bodySmall as TextStyle),
    color: colors.primary,
    fontWeight: "700",
  },
  placeCuisine: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textPrimary,
    fontWeight: "600",
  },
  placeSeparator: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textTertiary,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  amenityChip: {
    backgroundColor: colors.primaryLight + "15",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  amenityText: {
    ...(typography.caption as TextStyle),
    color: colors.primary,
    fontWeight: "600",
  },
  activityDetails: {
    flexDirection: "row",
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  activityDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  activityDetailText: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textPrimary,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    ...(typography.h3 as TextStyle),
    color: colors.textSecondary,
  },
})