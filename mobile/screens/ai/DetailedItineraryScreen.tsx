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
import { ArrowLeft, Clock, DollarSign, MapPin, Star, Camera } from "react-native-feather";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing, typography, borderRadius, shadows } from "../../theme/colors";
import { DetailedItinerary } from "../../api/itinerary.api";
import { ItineraryMap } from "../../components/ItineraryMap";

// Helper function to extract places from itinerary for map display
const extractPlacesFromItinerary = (itinerary: DetailedItinerary) => {
  const places: Array<{ name: string; city: string; type: string }> = [];

  // Add hotels
  if (itinerary.hotels) {
    itinerary.hotels.forEach(hotel => {
      places.push({
        name: hotel.name,
        city: itinerary.destination,
        type: 'hotel'
      });
    });
  }

  // Add activities from all days
  if (itinerary.days) {
    itinerary.days.forEach(day => {
      if (day.activities) {
        day.activities.forEach(activity => {
          places.push({
            name: activity.name,
            city: itinerary.destination,
            type: 'activity'
          });
        });
      }

      // Add meals/restaurants
      if (day.meals) {
        day.meals.forEach(meal => {
          if (meal.restaurant && meal.restaurant !== 'Local Restaurant') {
            places.push({
              name: meal.restaurant,
              city: itinerary.destination,
              type: 'restaurant'
            });
          }
        });
      }
    });
  }

  return places;
};

export default function DetailedItineraryScreen({ navigation, route }: any) {
  const { itinerary } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Itinerary</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trip Overview */}
        <LinearGradient
          colors={colors.gradientMagic}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.overviewSection}
        >
          {itinerary.coverImage && (
            <Image source={{ uri: itinerary.coverImage }} style={styles.coverImage} />
          )}
          <Text style={styles.destinationName}>{itinerary.destination}</Text>
          <View style={styles.overviewStats}>
            <View style={styles.statItem}>
              <Clock width={20} height={20} color={colors.white} />
              <Text style={styles.statText}>{itinerary.duration} days</Text>
            </View>
            <View style={styles.statItem}>
              <DollarSign width={20} height={20} color={colors.white} />
              <Text style={styles.statText}>${itinerary.totalBudget}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Destination Information */}
        {itinerary.destinationInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About {itinerary.destination}</Text>
            <View style={styles.destinationCard}>
              <Text style={styles.destinationDescription}>{itinerary.destinationInfo.description}</Text>
              <View style={styles.destinationDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Best Time to Visit:</Text>
                  <Text style={styles.detailValue}>{itinerary.destinationInfo.bestTimeToVisit}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Climate:</Text>
                  <Text style={styles.detailValue}>{itinerary.destinationInfo.climate}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Currency:</Text>
                  <Text style={styles.detailValue}>{itinerary.destinationInfo.currency}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Destination Photos */}
        {itinerary.photos && itinerary.photos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Camera width={20} height={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Destination Gallery</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
              {itinerary.photos.map((photo: any, index: number) => (
                <Image key={index} source={{ uri: photo }} style={styles.photo} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Map Integration */}
        {itinerary.mapData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Map</Text>
            <View style={styles.mapContainer}>
              <ItineraryMap places={extractPlacesFromItinerary(itinerary)} />
            </View>
          </View>
        )}

        {/* Hotels */}
        {itinerary.hotels && itinerary.hotels.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommended Hotels</Text>
            {itinerary.hotels.map((hotel: any, index: number) => (
              <View key={index} style={styles.hotelCard}>
                {hotel.photos && hotel.photos.length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hotelPhotos}>
                    {hotel.photos.map((photo: any, photoIndex: number) => (
                      <Image key={photoIndex} source={{ uri: photo }} style={styles.hotelPhoto} />
                    ))}
                  </ScrollView>
                )}
                <View style={styles.hotelInfo}>
                  <Text style={styles.hotelName}>{hotel.name}</Text>
                  <View style={styles.hotelRating}>
                    <Star width={14} height={14} color={colors.warning} fill={colors.warning} />
                    <Text style={styles.ratingText}>{hotel.rating}</Text>
                  </View>
                  <Text style={styles.hotelAmenities}>{(hotel.amenities || []).join(' • ')}</Text>
                </View>
                <Text style={styles.hotelPrice}>${hotel.pricePerNight}/night</Text>
              </View>
            ))}
          </View>
        )}

        {/* Daily Itinerary */}
        {itinerary.days && itinerary.days.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Day-by-Day Itinerary</Text>
            {itinerary.days.map((day: any, index: number) => (
              <View key={index} style={styles.dayCard}>
                <LinearGradient
                  colors={[colors.primary + '20', colors.primaryLight + '10']}
                  style={styles.dayHeader}
                >
                  <Text style={styles.dayNumber}>Day {day.day}</Text>
                  <Text style={styles.dayTheme}>{day.theme}</Text>
                  <Text style={styles.dayDate}>{day.date}</Text>
                </LinearGradient>

                {/* Activities */}
                <View style={styles.dayContent}>
                  {day.activities && day.activities.length > 0 && (
                    <>
                      <Text style={styles.subsectionTitle}>Activities</Text>
                      {day.activities.map((activity: any, actIndex: number) => (
                        <View key={actIndex} style={styles.activityItem}>
                          <View style={styles.activityTime}>
                            <Text style={styles.timeText}>{activity.time}</Text>
                          </View>
                          <View style={styles.activityDetails}>
                            <Text style={styles.activityName}>{activity.name}</Text>
                            <Text style={styles.activityDescription}>{activity.description}</Text>
                            <View style={styles.activityMeta}>
                              <MapPin width={12} height={12} color={colors.textSecondary} />
                              <Text style={styles.activityLocation}>{activity.location}</Text>
                              <Text style={styles.activityCost}>${activity.cost}</Text>
                            </View>
                            {activity.photos && activity.photos.length > 0 && (
                              <ScrollView horizontal style={styles.activityPhotos}>
                                {activity.photos.map((photo: any, photoIndex: number) => (
                                  <Image key={photoIndex} source={{ uri: photo }} style={styles.activityPhoto} />
                                ))}
                              </ScrollView>
                            )}
                          </View>
                        </View>
                      ))}
                    </>
                  )}

                  {/* Meals */}
                  {day.meals && day.meals.length > 0 && (
                    <>
                      <Text style={styles.subsectionTitle}>Meals</Text>
                      {day.meals.map((meal: any, mealIndex: number) => (
                        <View key={mealIndex} style={styles.mealItem}>
                          <View style={styles.mealTime}>
                            <Text style={styles.timeText}>🍽️ {meal.time}</Text>
                          </View>
                          <View style={styles.mealDetails}>
                            <Text style={styles.mealRestaurant}>{meal.restaurant}</Text>
                            <Text style={styles.mealCuisine}>{meal.cuisine} • ${meal.cost}</Text>
                            {meal.rating && (
                              <View style={styles.mealRating}>
                                <Star width={12} height={12} color={colors.warning} fill={colors.warning} />
                                <Text style={styles.ratingText}>{meal.rating}</Text>
                              </View>
                            )}
                            {meal.photos && meal.photos.length > 0 && (
                              <ScrollView horizontal style={styles.mealPhotos}>
                                {meal.photos.map((photo: any, photoIndex: number) => (
                                  <Image key={photoIndex} source={{ uri: photo }} style={styles.mealPhoto} />
                                ))}
                              </ScrollView>
                            )}
                          </View>
                        </View>
                      ))}
                    </>
                  )}

                  <View style={styles.dayCost}>
                    <Text style={styles.dayCostText}>Day Total: ${day.estimatedCost}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Travel Tips */}
        {itinerary.travelTips && itinerary.travelTips.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Travel Tips</Text>
            {itinerary.travelTips.map((tip: any, index: number) => (
              <View key={index} style={styles.tipItem}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}
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
  overviewSection: {
    padding: spacing.xl,
    alignItems: "center",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: 200,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    opacity: 0.8,
  },
  destinationName: {
    ...(typography.h1 as TextStyle),
    color: colors.white,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  overviewStats: {
    flexDirection: "row",
    gap: spacing.xl,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  statText: {
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
  destinationCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  destinationDescription: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  destinationDetails: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textSecondary,
    fontWeight: "600",
  },
  detailValue: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textPrimary,
    flex: 1,
    textAlign: "right",
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
  hotelPhotos: {
    marginBottom: spacing.md,
  },
  hotelPhoto: {
    width: 120,
    height: 80,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  hotelCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  hotelInfo: {
    marginBottom: spacing.sm,
  },
  hotelName: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  hotelRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  ratingText: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textSecondary,
  },
  hotelAmenities: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textSecondary,
  },
  hotelPrice: {
    ...(typography.body as TextStyle),
    color: colors.primary,
    fontWeight: "600",
  },
  dayCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: "hidden",
    ...shadows.md,
  },
  dayHeader: {
    padding: spacing.md,
  },
  dayNumber: {
    ...(typography.h3 as TextStyle),
    color: colors.primary,
    fontWeight: "700",
  },
  dayTheme: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    fontWeight: "600",
    marginTop: spacing.xs,
  },
  dayDate: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  dayContent: {
    padding: spacing.md,
  },
  subsectionTitle: {
    ...(typography.h4 as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  activityItem: {
    flexDirection: "row",
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityTime: {
    width: 60,
    alignItems: "center",
    paddingTop: spacing.xs,
  },
  timeText: {
    ...(typography.bodySmall as TextStyle),
    color: colors.primary,
    fontWeight: "600",
  },
  activityDetails: {
    flex: 1,
    paddingLeft: spacing.md,
  },
  activityName: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  activityDescription: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  activityMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  activityLocation: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textSecondary,
    flex: 1,
  },
  activityCost: {
    ...(typography.bodySmall as TextStyle),
    color: colors.primary,
    fontWeight: "600",
  },
  activityPhotos: {
    marginTop: spacing.sm,
  },
  activityPhoto: {
    width: 80,
    height: 60,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  mealItem: {
    flexDirection: "row",
    marginBottom: spacing.md,
    alignItems: "flex-start",
  },
  mealTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    width: 80,
  },
  mealDetails: {
    flex: 1,
    paddingLeft: spacing.md,
  },
  mealRestaurant: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  mealCuisine: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  mealRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  dayCost: {
    alignItems: "flex-end",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dayCostText: {
    ...(typography.body as TextStyle),
    color: colors.primary,
    fontWeight: "700",
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  tipText: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    flex: 1,
  },
  mealPhotos: {
    marginTop: spacing.sm,
  },
  mealPhoto: {
    width: 60,
    height: 45,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  mapPlaceholderText: {
    ...(typography.body as TextStyle),
    color: colors.textSecondary,
  },
  mapContainer: {
    height: 300,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
});
