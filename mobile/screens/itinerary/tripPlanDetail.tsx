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
import { MapPin, Calendar, DollarSign, Clock, Star, ChevronRight, Info, Zap } from "react-native-feather"
import { LinearGradient } from "expo-linear-gradient"
import { colors, spacing, typography, borderRadius, shadows } from "../../theme/colors"
import { TripMap } from "../../components/TripMap"
import { PersonalizationIndicator } from "../../components/PersonalizationIndicator"
import { GlassmorphicCard } from "../../components/GlassmorphicCard"
import { useTripPlannerStore } from "../../store/tripPlannerStore"

export default function TripPlanDetailScreen({ route }: any) {
  const { itinerary } = route.params || {}
  const [selectedTab, setSelectedTab] = useState<"schedule" | "summary" | "tips">("schedule")

  // Debug logging
  console.log('TripPlanDetailScreen - route.params:', route.params)
  console.log('TripPlanDetailScreen - itinerary:', itinerary)
  console.log('TripPlanDetailScreen - itinerary.itinerary:', itinerary?.itinerary)
  console.log('TripPlanDetailScreen - itinerary.summary:', itinerary?.summary)

  if (!itinerary) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No trip plan available</Text>
          <Text style={styles.emptyText}>Route params: {JSON.stringify(route.params)}</Text>
        </View>
      </SafeAreaView>
    )
  }

  const renderSchedule = () => (
    <View style={styles.tabContent}>
      {itinerary.itinerary?.length > 0 ? (
        itinerary.itinerary.map((day: any, dayIndex: number) => (
          <View key={dayIndex} style={styles.dayCard}>
            <LinearGradient
              colors={[colors.primary + '20', colors.primaryLight + '10']}
              style={styles.dayHeader}
            >
              <Text style={styles.dayNumber}>Day {day.day}</Text>
              <Text style={styles.dayTheme}>{day.theme || 'Daily Activities'}</Text>
              <Text style={styles.dayDate}>{new Date(day.date).toLocaleDateString()}</Text>
            </LinearGradient>

            <View style={styles.dayContent}>
              {day.schedule?.map((item: any, itemIndex: number) => (
                <View key={itemIndex} style={styles.scheduleItem}>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemVenue}>{item.venue?.name || 'Venue'}</Text>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                    <View style={styles.itemMeta}>
                      <Text style={styles.itemType}>{item.type}</Text>
                      {item.venue?.rating && (
                        <View style={styles.ratingContainer}>
                          <Star width={12} height={12} color={colors.warning} fill={colors.warning} />
                          <Text style={styles.ratingText}>{item.venue.rating}</Text>
                        </View>
                      )}
                      {item.venue?.priceRange && (
                        <Text style={styles.priceRange}>{item.venue.priceRange}</Text>
                      )}
                    </View>
                  </View>
                </View>
              )) || (
                <Text style={styles.emptyText}>No schedule available for this day</Text>
              )}
              
              {day.estimatedCost && (
                <View style={styles.dayCost}>
                  <DollarSign width={16} height={16} color={colors.primary} />
                  <Text style={styles.dayCostText}>Daily cost: ${day.estimatedCost}</Text>
                </View>
              )}
            </View>
          </View>
        ))
      ) : itinerary.days?.length > 0 ? (
        // Fallback for legacy format
        itinerary.days.map((day: any, dayIndex: number) => (
          <View key={dayIndex} style={styles.dayCard}>
            <LinearGradient
              colors={[colors.primary + '20', colors.primaryLight + '10']}
              style={styles.dayHeader}
            >
              <Text style={styles.dayNumber}>Day {dayIndex + 1}</Text>
              <Text style={styles.dayTheme}>Daily Activities</Text>
              <Text style={styles.dayDate}>{day.date}</Text>
            </LinearGradient>
            <View style={styles.dayContent}>
              {day.events?.map((event: any, eventIndex: number) => (
                <View key={eventIndex} style={styles.scheduleItem}>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{event.startTime}</Text>
                  </View>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemTitle}>{event.title}</Text>
                    <Text style={styles.itemVenue}>{event.location}</Text>
                    <Text style={styles.itemDescription}>{event.description || event.category}</Text>
                    <View style={styles.itemMeta}>
                      <Text style={styles.itemType}>{event.category}</Text>
                      <Text style={styles.priceRange}>${event.budget}</Text>
                    </View>
                  </View>
                </View>
              )) || <Text style={styles.emptyText}>No events for this day</Text>}
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No schedule data available</Text>
          <Text style={styles.emptyText}>Available data: {Object.keys(itinerary).join(', ')}</Text>
        </View>
      )}
    </View>
  )

  const renderSummary = () => (
    <View style={styles.tabContent}>
      {/* Trip Overview */}
      <GlassmorphicCard style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Trip Overview</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Destination:</Text>
          <Text style={styles.summaryValue}>{itinerary.destination}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Duration:</Text>
          <Text style={styles.summaryValue}>{itinerary.duration} days</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Travelers:</Text>
          <Text style={styles.summaryValue}>{itinerary.travelers}</Text>
        </View>
        {itinerary.summary?.totalCost && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimated Cost:</Text>
            <Text style={[styles.summaryValue, { color: colors.primary }]}>${itinerary.summary.totalCost}</Text>
          </View>
        )}
      </GlassmorphicCard>

      {/* Destination Info */}
      {itinerary.summary && (
        <GlassmorphicCard style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Destination Information</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Best time to visit:</Text>
            <Text style={styles.summaryValue}>{itinerary.summary.bestTimeToVisit}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Currency:</Text>
            <Text style={styles.summaryValue}>{itinerary.summary.localCurrency}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Time zone:</Text>
            <Text style={styles.summaryValue}>{itinerary.summary.timeZone}</Text>
          </View>
        </GlassmorphicCard>
      )}

      {/* Highlights */}
      {itinerary.summary?.highlights && (
        <GlassmorphicCard style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Trip Highlights</Text>
          {itinerary.summary.highlights.map((highlight: string, index: number) => (
            <View key={index} style={styles.highlightItem}>
              <View style={styles.highlightDot} />
              <Text style={styles.highlightText}>{highlight}</Text>
            </View>
          ))}
        </GlassmorphicCard>
      )}

      {/* Accommodations */}
      {itinerary.summary?.accommodations?.length > 0 && (
        <GlassmorphicCard style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Accommodations</Text>
          {itinerary.summary.accommodations.map((hotel: any, index: number) => (
            <View key={index} style={styles.hotelItem}>
              <Text style={styles.hotelName}>{hotel.name}</Text>
              <View style={styles.hotelDetails}>
                <Star width={14} height={14} color={colors.warning} fill={colors.warning} />
                <Text style={styles.hotelRating}>{hotel.rating}</Text>
                <Text style={styles.hotelPrice}>{hotel.priceRange}</Text>
              </View>
              <Text style={styles.hotelAmenities}>{hotel.amenities?.join(', ')}</Text>
            </View>
          ))}
        </GlassmorphicCard>
      )}
    </View>
  )

  const renderTips = () => (
    <View style={styles.tabContent}>
      {/* Weather Tips */}
      {itinerary.summary?.weatherTips && (
        <GlassmorphicCard style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Weather Tips</Text>
          {itinerary.summary.weatherTips.map((tip: string, index: number) => (
            <View key={index} style={styles.tipItem}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </GlassmorphicCard>
      )}

      {/* Packing List */}
      {itinerary.summary?.packingList && (
        <GlassmorphicCard style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Packing List</Text>
          <View style={styles.packingGrid}>
            {itinerary.summary.packingList.map((item: string, index: number) => (
              <View key={index} style={styles.packingItem}>
                <Text style={styles.packingText}>{item}</Text>
              </View>
            ))}
          </View>
        </GlassmorphicCard>
      )}

      {/* Daily Tips */}
      {itinerary.itinerary?.some((day: any) => day.tips) && (
        <GlassmorphicCard style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Daily Tips</Text>
          {itinerary.itinerary.map((day: any, index: number) => (
            day.tips && (
              <View key={index} style={styles.dailyTipSection}>
                <Text style={styles.dailyTipDay}>Day {day.day}</Text>
                {day.tips.map((tip: string, tipIndex: number) => (
                  <View key={tipIndex} style={styles.tipItem}>
                    <View style={styles.tipDot} />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            )
          ))}
        </GlassmorphicCard>
      )}
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
        <Text style={styles.destination}>{itinerary.destination}</Text>
        <View style={styles.headerDetails}>
          <View style={styles.headerDetail}>
            <Calendar width={16} height={16} color={colors.white} />
            <Text style={styles.headerDetailText}>{itinerary.duration} days</Text>
          </View>
          <View style={styles.headerDetail}>
            <DollarSign width={16} height={16} color={colors.white} />
            <Text style={styles.headerDetailText}>${itinerary.summary?.totalCost || itinerary.budget || 'N/A'}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "schedule" && styles.activeTab]}
          onPress={() => setSelectedTab("schedule")}
        >
          <Clock width={20} height={20} color={selectedTab === "schedule" ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, selectedTab === "schedule" && styles.activeTabText]}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "summary" && styles.activeTab]}
          onPress={() => setSelectedTab("summary")}
        >
          <Info width={20} height={20} color={selectedTab === "summary" ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, selectedTab === "summary" && styles.activeTabText]}>Summary</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "tips" && styles.activeTab]}
          onPress={() => setSelectedTab("tips")}
        >
          <Zap width={20} height={20} color={selectedTab === "tips" ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, selectedTab === "tips" && styles.activeTabText]}>Tips</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === "schedule" && renderSchedule()}
        {selectedTab === "summary" && renderSummary()}
        {selectedTab === "tips" && renderTips()}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...(typography.h3 as TextStyle),
    color: colors.textSecondary,
    textAlign: 'center',
  },
  header: {
    padding: spacing.xl,
    paddingBottom: spacing.lg,
  },
  destination: {
    ...(typography.h1 as TextStyle),
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  headerDetails: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  headerDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerDetailText: {
    ...(typography.body as TextStyle),
    color: colors.white,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...(typography.bodyMedium as TextStyle),
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: spacing.lg,
  },
  dayCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  dayHeader: {
    padding: spacing.md,
    alignItems: 'center',
  },
  dayNumber: {
    ...(typography.h3 as TextStyle),
    color: colors.primary,
    fontWeight: '700',
  },
  dayTheme: {
    ...(typography.bodyMedium as TextStyle),
    color: colors.textPrimary,
    fontWeight: '600',
  },
  dayDate: {
    ...(typography.caption as TextStyle),
    color: colors.textSecondary,
  },
  dayContent: {
    padding: spacing.md,
  },
  scheduleItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  timeContainer: {
    width: 60,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  timeText: {
    ...(typography.caption as TextStyle),
    color: colors.primary,
    fontWeight: '600',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    ...(typography.bodyMedium as TextStyle),
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemVenue: {
    ...(typography.caption as TextStyle),
    color: colors.textSecondary,
    marginBottom: 4,
  },
  itemDescription: {
    ...(typography.small as TextStyle),
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  itemType: {
    ...(typography.small as TextStyle),
    color: colors.primary,
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    textTransform: 'capitalize',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    ...(typography.small as TextStyle),
    color: colors.textSecondary,
  },
  priceRange: {
    ...(typography.small as TextStyle),
    color: colors.textSecondary,
  },
  dayCost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dayCostText: {
    ...(typography.bodyMedium as TextStyle),
    color: colors.primary,
    fontWeight: '600',
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    ...(typography.h3 as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    ...(typography.body as TextStyle),
    color: colors.textSecondary,
  },
  summaryValue: {
    ...(typography.bodyMedium as TextStyle),
    color: colors.textPrimary,
    fontWeight: '600',
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  highlightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: spacing.sm,
  },
  highlightText: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    flex: 1,
  },
  hotelItem: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  hotelName: {
    ...(typography.bodyMedium as TextStyle),
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  hotelDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  hotelRating: {
    ...(typography.small as TextStyle),
    color: colors.textSecondary,
  },
  hotelPrice: {
    ...(typography.small as TextStyle),
    color: colors.textSecondary,
  },
  hotelAmenities: {
    ...(typography.small as TextStyle),
    color: colors.textSecondary,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  tipDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.secondary,
    marginTop: 6,
    marginRight: spacing.sm,
  },
  tipText: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    flex: 1,
  },
  packingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  packingItem: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  packingText: {
    ...(typography.small as TextStyle),
    color: colors.primary,
  },
  dailyTipSection: {
    marginBottom: spacing.md,
  },
  dailyTipDay: {
    ...(typography.bodyMedium as TextStyle),
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
});