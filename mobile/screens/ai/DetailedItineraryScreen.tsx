import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextStyle,
  Dimensions,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Clock, DollarSign, MapPin, Star, Camera, Users, Calendar, X } from "react-native-feather";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing, typography, borderRadius, shadows } from "../../theme/colors";
import { DetailedItinerary } from "../../api/itinerary.api";
import { ItineraryMap } from "../../components/ItineraryMap";

const { width: screenWidth } = Dimensions.get('window');

// Enhanced helper functions
const extractPlacesFromItinerary = (itinerary: DetailedItinerary) => {
  const places: Array<{ name: string; city: string; type: string; coordinates?: { lat: number; lng: number } }> = [];

  if (itinerary.summary?.accommodations) {
    itinerary.summary.accommodations.forEach(hotel => {
      places.push({
        name: hotel.name,
        city: itinerary.destination,
        type: 'hotel',
        coordinates: (hotel as any)?.coordinates
      });
    });
  }

  if (itinerary.itinerary) {
    itinerary.itinerary.forEach(day => {
      if (day.schedule) {
        day.schedule.forEach(item => {
          places.push({
            name: item.type === 'meal' ? item.venue.name : item.title,
            city: itinerary.destination,
            type: item.type === 'meal' ? 'restaurant' : 'activity',
            coordinates: (item.venue as any)?.coordinates
          });
        });
      }
    });
  }

  return places;
};

const getDestinationImages = (itinerary: DetailedItinerary) => {
  const images = [];
  
  // Add cover image
  if ((itinerary as any).coverImage) images.push((itinerary as any).coverImage);
  
  // Add destination images from backend
  if ((itinerary as any).images) images.push(...(itinerary as any).images);
  
  // Add venue images from daily schedules
  if (itinerary.itinerary) {
    itinerary.itinerary.forEach(day => {
      day.schedule?.forEach(item => {
        if (item.venue?.image) images.push(item.venue.image);
      });
    });
  }
  
  // Add accommodation images
  if (itinerary.summary?.accommodations) {
    itinerary.summary.accommodations.forEach(hotel => {
      if ((hotel as any)?.image) images.push((hotel as any).image);
    });
  }
  
  return [...new Set(images)]; // Remove duplicates
};

export default function DetailedItineraryScreen({ navigation, route }: any) {
  const { itinerary } = route.params;
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'map'>('overview');
  
  const destinationImages = useMemo(() => getDestinationImages(itinerary), [itinerary]);
  const mapPlaces = useMemo(() => extractPlacesFromItinerary(itinerary), [itinerary]);

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
        {/* Enhanced Hero Section */}
        <View style={styles.heroSection}>
          {(destinationImages.length > 0 || (itinerary as any).coverImage) && (
            <TouchableOpacity onPress={() => setSelectedImageIndex(0)}>
              <Image 
                source={{ uri: destinationImages[0] || (itinerary as any).coverImage }} 
                style={styles.heroImage} 
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.heroOverlay}
              />
            </TouchableOpacity>
          )}
          <View style={styles.heroContent}>
            <Text style={styles.destinationName}>{itinerary.destination}</Text>
            <View style={styles.heroStats}>
              <View style={styles.statCard}>
                <Clock width={16} height={16} color={colors.primary} />
                <Text style={styles.statLabel}>Duration</Text>
                <Text style={styles.statValue}>{itinerary.duration} days</Text>
              </View>
              <View style={styles.statCard}>
                <DollarSign width={16} height={16} color={colors.primary} />
                <Text style={styles.statLabel}>Budget</Text>
                <Text style={styles.statValue}>${itinerary.summary?.totalCost || itinerary.budget || 'N/A'}</Text>
              </View>
              <View style={styles.statCard}>
                <Users width={16} height={16} color={colors.primary} />
                <Text style={styles.statLabel}>Travelers</Text>
                <Text style={styles.statValue}>{itinerary.travelers || 2}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {(['overview', 'schedule', 'map'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Enhanced Photo Gallery */}
            {destinationImages.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Camera width={20} height={20} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Gallery ({destinationImages.length} photos)</Text>
                </View>
                
                {/* Image Categories */}
                <View style={styles.imageCategoriesContainer}>
                  <View style={styles.imageCategory}>
                    <Text style={styles.imageCategoryTitle}>🏛️ Architecture & Landmarks</Text>
                    <Text style={styles.imageCategoryDesc}>Iconic buildings and city views</Text>
                  </View>
                  <View style={styles.imageCategory}>
                    <Text style={styles.imageCategoryTitle}>🍽️ Local Cuisine & Dining</Text>
                    <Text style={styles.imageCategoryDesc}>Restaurants and food experiences</Text>
                  </View>
                  <View style={styles.imageCategory}>
                    <Text style={styles.imageCategoryTitle}>🎨 Culture & Activities</Text>
                    <Text style={styles.imageCategoryDesc}>Museums, attractions, and experiences</Text>
                  </View>
                </View>
                
                <FlatList
                  data={destinationImages}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => `gallery-${index}-${item}`}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => setSelectedImageIndex(index)}>
                      <Image source={{ uri: item }} style={styles.galleryImage} />
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.galleryContainer}
                />
              </View>
            )}
          </>
        )}

        {activeTab === 'map' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interactive Itinerary Map</Text>
            <Text style={styles.mapDescription}>
              Explore all your planned destinations, activities, and accommodations
            </Text>
            <View style={styles.enhancedMapContainer}>
              <ItineraryMap places={mapPlaces} />
              <View style={styles.mapLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                  <Text style={styles.legendText}>Activities ({mapPlaces.filter(p => p.type === 'activity').length})</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
                  <Text style={styles.legendText}>Hotels ({mapPlaces.filter(p => p.type === 'hotel').length})</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
                  <Text style={styles.legendText}>Restaurants ({mapPlaces.filter(p => p.type === 'restaurant').length})</Text>
                </View>
              </View>
            </View>
            
            {/* Places List */}
            <View style={styles.placesListContainer}>
              <Text style={styles.placesListTitle}>All Locations ({mapPlaces.length})</Text>
              {mapPlaces.map((place, index) => (
                <View key={`${place.name}-${place.coordinates?.lat}-${place.coordinates?.lng}-${index}`} style={styles.placeItem}>
                  <View style={[styles.placeTypeIndicator, { 
                    backgroundColor: place.type === 'hotel' ? colors.success : 
                                   place.type === 'restaurant' ? colors.warning : colors.primary 
                  }]} />
                  <View style={styles.placeInfo}>
                    <Text style={styles.placeName}>{place.name}</Text>
                    <Text style={styles.placeType}>{place.type.charAt(0).toUpperCase() + place.type.slice(1)}</Text>
                  </View>
                  <MapPin width={16} height={16} color={colors.textSecondary} />
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'schedule' && itinerary.itinerary && itinerary.itinerary.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Day-by-Day Schedule</Text>
            {itinerary.itinerary.map((day: any, dayIndex: number) => (
              <View key={`day-${day.day}-${dayIndex}`} style={styles.enhancedDayCard}>
                <LinearGradient
                  colors={[colors.primary + '15', colors.primaryLight + '08']}
                  style={styles.enhancedDayHeader}
                >
                  <View style={styles.dayHeaderLeft}>
                    <Text style={styles.dayNumber}>Day {day.day}</Text>
                    <Text style={styles.dayTheme}>{day.theme}</Text>
                  </View>
                  <View style={styles.dayHeaderRight}>
                    <Calendar width={16} height={16} color={colors.primary} />
                    <Text style={styles.dayDate}>{day.date}</Text>
                  </View>
                </LinearGradient>

                <View style={styles.dayContent}>
                  {day.schedule?.map((item: any, itemIndex: number) => (
                    <View key={`activity-${day.day}-${itemIndex}-${item.time}`} style={styles.enhancedActivityItem}>
                      <View style={styles.timelineContainer}>
                        <View style={styles.timelineDot} />
                        {itemIndex < day.schedule.length - 1 && <View style={styles.timelineLine} />}
                      </View>
                      <View style={styles.activityTime}>
                        <Text style={styles.timeText}>{item.time}</Text>
                      </View>
                      <View style={styles.activityDetails}>
                        {item.venue.image && (
                          <Image source={{ uri: item.venue.image }} style={styles.venueImage} />
                        )}
                        <View style={styles.activityHeader}>
                          <Text style={styles.activityName}>{item.title}</Text>
                          <View style={styles.activityType}>
                            <Text style={styles.activityTypeText}>{item.type}</Text>
                          </View>
                        </View>
                        <Text style={styles.activityDescription}>{item.description}</Text>
                        <View style={styles.activityMeta}>
                          <MapPin width={12} height={12} color={colors.textSecondary} />
                          <Text style={styles.activityLocation}>{item.venue.name}</Text>
                          <Text style={styles.activityCost}>{item.venue.priceRange}</Text>
                        </View>
                        {item.venue.rating && (
                          <View style={styles.venueRating}>
                            <Star width={12} height={12} color={colors.warning} fill={colors.warning} />
                            <Text style={styles.ratingText}>{item.venue.rating}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                  
                  {day.tips && day.tips.length > 0 && (
                    <View style={styles.enhancedTipsSection}>
                      <Text style={styles.subsectionTitle}>💡 Daily Tips</Text>
                      {day.tips.map((tip: string, tipIndex: number) => (
                        <View key={`tip-${day.day}-${tipIndex}`} style={styles.tipItem}>
                          <View style={styles.tipBullet} />
                          <Text style={styles.tipText}>{tip}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
        {/* Travel Tips - Show on all tabs */}
        {itinerary.summary?.weatherTips && itinerary.summary.weatherTips.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌟 Travel Tips</Text>
            <View style={styles.tipsGrid}>
              {itinerary.summary.weatherTips.map((tip: string, index: number) => (
                <View key={`weather-tip-${index}`} style={styles.tipCard}>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Image Modal */}
      <Modal
        visible={selectedImageIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImageIndex(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setSelectedImageIndex(null)}
          >
            <X width={24} height={24} color={colors.white} />
          </TouchableOpacity>
          {selectedImageIndex !== null && (
            <FlatList
              data={destinationImages}
              horizontal
              pagingEnabled
              initialScrollIndex={selectedImageIndex}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `modal-${index}-${item}`}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.modalImage} />
              )}
              getItemLayout={(data, index) => ({
                length: screenWidth,
                offset: screenWidth * index,
                index,
              })}
            />
          )}
        </View>
      </Modal>
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
    ...shadows.md,
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
    position: 'relative',
    height: 280,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  heroContent: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
  },
  destinationName: {
    ...(typography.h1 as TextStyle),
    color: colors.white,
    marginBottom: spacing.md,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    minWidth: 80,
    ...shadows.sm,
  },
  statLabel: {
    ...(typography.caption as TextStyle),
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statValue: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    ...shadows.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...(typography.body as TextStyle),
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.white,
    fontWeight: '600',
  },
  galleryContainer: {
    paddingHorizontal: spacing.lg,
  },
  imageCategoriesContainer: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  imageCategory: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    ...shadows.sm,
  },
  imageCategoryTitle: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  imageCategoryDesc: {
    ...(typography.caption as TextStyle),
    color: colors.textSecondary,
  },
  galleryImage: {
    width: 140,
    height: 100,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    ...shadows.sm,
  },
  enhancedMapContainer: {
    height: 300,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  mapDescription: {
    ...(typography.body as TextStyle),
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  placesListContainer: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  placesListTitle: {
    ...(typography.h4 as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  placeTypeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.md,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    fontWeight: '600',
  },
  placeType: {
    ...(typography.caption as TextStyle),
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  mapLegend: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    ...shadows.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  legendText: {
    ...(typography.caption as TextStyle),
    color: colors.textPrimary,
  },
  enhancedDayCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  enhancedDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  dayHeaderLeft: {
    flex: 1,
  },
  dayHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  enhancedActivityItem: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  timelineContainer: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: spacing.xs,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  activityType: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  activityTypeText: {
    ...(typography.caption as TextStyle),
    color: colors.primary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  venueRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  venueImage: {
    width: '100%',
    height: 120,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    resizeMode: 'cover',
    ...shadows.sm,
  },
  enhancedTipsSection: {
    margin: spacing.lg,
    marginTop: 0,
    padding: spacing.lg,
    backgroundColor: colors.primary + '08',
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  tipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tipCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flex: 1,
    minWidth: '45%',
    ...shadows.sm,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: spacing.lg,
    zIndex: 1,
    padding: spacing.md,
  },
  modalImage: {
    width: screenWidth,
    height: '100%',
    resizeMode: 'contain',
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...(typography.h3 as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  dayNumber: {
    ...(typography.h2 as TextStyle),
    color: colors.primary,
    fontWeight: '800',
  },
  dayTheme: {
    ...(typography.h4 as TextStyle),
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  dayDate: {
    ...(typography.body as TextStyle),
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  dayContent: {
    padding: spacing.lg,
  },
  subsectionTitle: {
    ...(typography.h4 as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    fontWeight: '600',
  },
  activityTime: {
    width: 70,
    marginRight: spacing.md,
  },
  timeText: {
    ...(typography.body as TextStyle),
    color: colors.primary,
    fontWeight: '700',
  },
  activityDetails: {
    flex: 1,
  },
  activityName: {
    ...(typography.h4 as TextStyle),
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  activityDescription: {
    ...(typography.body as TextStyle),
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  activityLocation: {
    ...(typography.caption as TextStyle),
    color: colors.textSecondary,
    flex: 1,
  },
  activityCost: {
    ...(typography.body as TextStyle),
    color: colors.primary,
    fontWeight: '600',
  },
  ratingText: {
    ...(typography.body as TextStyle),
    color: colors.textSecondary,
    fontWeight: '500',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: spacing.sm,
  },
  tipText: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
});
