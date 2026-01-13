import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, MapPin, Clock, DollarSign, Star, Camera, Home, Compass } from "react-native-feather";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing, typography, borderRadius, shadows } from "../../theme/colors";
import { GradientButton } from "../../components/GradientButton";
import { TripSuggestion } from "../../api/ai-trip.api";
import { itineraryApi } from "../../api/itinerary.api";
import { showToast } from "../../utils/toast";
import { ItineraryMap } from "../../components/ItineraryMap";

export default function TripDetailScreen({ navigation, route }: any) {
  const { trip } = route.params;

  const handleBookTrip = async () => {
    try {
      const detailedItinerary = await itineraryApi.generateDetailedItinerary(
        trip.destination, 
        trip.duration
      );
      navigation.navigate("DetailedItinerary", { itinerary: detailedItinerary });
    } catch (error: any) {
      showToast({
        type: "error",
        text1: "Planning Failed",
        text2: error.response?.data?.message || "Failed to generate itinerary"
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{trip.destination}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={colors.gradientTravel}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <Text style={styles.destinationName}>{trip.destination}</Text>
          <Text style={styles.countryName}>{trip.country}</Text>
          <View style={styles.matchBadge}>
            <Star width={16} height={16} color={colors.white} fill={colors.white} />
            <Text style={styles.matchText}>{trip.matchScore}% Match</Text>
          </View>
        </LinearGradient>

        {/* Map Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin width={20} height={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Location Preview</Text>
          </View>
          <ItineraryMap
            destination={trip.destination}
            hotels={trip.hotels || []}
            activities={[]}
          />
        </View>

        {/* Trip Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Overview</Text>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Clock width={20} height={20} color={colors.primary} />
              <Text style={styles.overviewLabel}>Duration</Text>
              <Text style={styles.overviewValue}>{trip.duration} days</Text>
            </View>
            <View style={styles.overviewItem}>
              <DollarSign width={20} height={20} color={colors.primary} />
              <Text style={styles.overviewLabel}>Budget</Text>
              <Text style={styles.overviewValue}>${trip.estimatedBudget}</Text>
            </View>
            <View style={styles.overviewItem}>
              <MapPin width={20} height={20} color={colors.primary} />
              <Text style={styles.overviewLabel}>Best Time</Text>
              <Text style={styles.overviewValue}>{trip.bestTimeToVisit}</Text>
            </View>
          </View>
        </View>

        {/* Photos */}
        {trip.photos && trip.photos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Camera width={20} height={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Destination Photos</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
              {trip.photos.map((photo: any, index: number) => (
                <Image key={index} source={{ uri: photo }} style={styles.photo} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Highlights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Highlights</Text>
          <View style={styles.highlightsList}>
            {trip.highlights.map((highlight: any, index: number) => (
              <View key={index} style={styles.highlightItem}>
                <View style={styles.highlightBullet} />
                <Text style={styles.highlightText}>{highlight}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Activities</Text>
          <View style={styles.activitiesGrid}>
            {trip.activities.map((activity: any, index: number) => (
              <View key={index} style={styles.activityCard}>
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Hotels */}
        {trip.hotels && trip.hotels.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Home width={20} height={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Recommended Hotels</Text>
            </View>
            {trip.hotels.map((hotel: any, index: number) => (
              <View key={index} style={styles.hotelCard}>
                <View style={styles.hotelInfo}>
                  <Text style={styles.hotelName}>{hotel.title || hotel.name}</Text>
                  <Text style={styles.hotelAddress}>{hotel.address}</Text>
                  {hotel.rating && (
                    <View style={styles.hotelRating}>
                      <Star width={14} height={14} color={colors.warning} fill={colors.warning} />
                      <Text style={styles.ratingText}>{hotel.rating}</Text>
                    </View>
                  )}
                </View>
                {hotel.price && (
                  <Text style={styles.hotelPrice}>${hotel.price}/night</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Local Attractions */}
        {trip.localAttractions && trip.localAttractions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Compass width={20} height={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Local Attractions</Text>
            </View>
            {trip.localAttractions.map((attraction: any, index: number) => (
              <View key={index} style={styles.attractionCard}>
                <Text style={styles.attractionName}>{attraction.title || attraction.name}</Text>
                <Text style={styles.attractionAddress}>{attraction.address}</Text>
                {attraction.rating && (
                  <View style={styles.attractionRating}>
                    <Star width={14} height={14} color={colors.warning} fill={colors.warning} />
                    <Text style={styles.ratingText}>{attraction.rating}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Book Trip Button */}
        <View style={styles.bookSection}>
          <GradientButton
            title="Plan This Trip"
            onPress={handleBookTrip}
            gradient={colors.gradientPurple}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    ...(typography.h3 as TextStyle),
    color: colors.white,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    padding: spacing.xl,
    alignItems: "center",
  },
  destinationName: {
    ...(typography.h1 as TextStyle),
    color: colors.white,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  countryName: {
    ...(typography.h3 as TextStyle),
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: spacing.lg,
  },
  matchBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  matchText: {
    ...(typography.body as TextStyle),
    color: colors.white,
    fontWeight: "600",
  },
  section: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...(typography.h3 as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  overviewGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  overviewItem: {
    alignItems: "center",
    flex: 1,
  },
  overviewLabel: {
    ...(typography.caption as TextStyle),
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  overviewValue: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    fontWeight: "600",
    marginTop: spacing.xs,
  },
  photosContainer: {
    marginTop: spacing.sm,
  },
  photo: {
    width: 200,
    height: 120,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  highlightsList: {
    gap: spacing.md,
  },
  highlightItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  highlightBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  highlightText: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    flex: 1,
  },
  activitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  activityCard: {
    backgroundColor: colors.primaryLight + "15",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  activityText: {
    ...(typography.bodySmall as TextStyle),
    color: colors.primary,
    fontWeight: "600",
  },
  hotelCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...shadows.sm,
  },
  hotelInfo: {
    flex: 1,
  },
  hotelName: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  hotelAddress: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  hotelRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  ratingText: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textSecondary,
  },
  hotelPrice: {
    ...(typography.body as TextStyle),
    color: colors.primary,
    fontWeight: "600",
  },
  attractionCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  attractionName: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  attractionAddress: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  attractionRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  bookSection: {
    padding: spacing.lg,
  },
});