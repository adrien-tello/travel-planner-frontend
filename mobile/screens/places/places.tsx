import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Star, DollarSign } from 'react-native-feather';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme/colors';
import { placesApi, Hotel, Restaurant, Activity } from '../../api/places.api';

type TabType = 'hotels' | 'restaurants' | 'activities';

export default function PlacesScreen() {
  const [selectedTab, setSelectedTab] = useState<TabType>('hotels');
  const [destination, setDestination] = useState('Paris');
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    loadData();
  }, [selectedTab, destination]);

  const loadData = async () => {
    if (!destination) return;
    
    setLoading(true);
    try {
      if (selectedTab === 'hotels') {
        const data = await placesApi.getHotels(destination, 'mid');
        setHotels(data);
      } else if (selectedTab === 'restaurants') {
        const data = await placesApi.getRestaurants(destination, 'mid');
        setRestaurants(data);
      } else {
        const data = await placesApi.getActivities(destination, 'mid');
        setActivities(data);
      }
    } catch (error) {
      console.error('Load places error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderHotel = (hotel: Hotel) => (
    <TouchableOpacity key={hotel.id} style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{hotel.name}</Text>
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Star width={14} height={14} color={colors.warning} fill={colors.warning} />
            <Text style={styles.metaText}>{hotel.rating}</Text>
          </View>
          <View style={styles.metaItem}>
            <DollarSign width={14} height={14} color={colors.primary} />
            <Text style={styles.metaText}>${hotel.pricePerNight}/night</Text>
          </View>
        </View>
        <View style={styles.cardLocation}>
          <MapPin width={12} height={12} color={colors.textSecondary} />
          <Text style={styles.locationText}>{hotel.location}</Text>
        </View>
        <View style={styles.amenitiesContainer}>
          {hotel.amenities.slice(0, 3).map((amenity, idx) => (
            <View key={idx} style={styles.amenityChip}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRestaurant = (restaurant: Restaurant) => (
    <TouchableOpacity key={restaurant.id} style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{restaurant.name}</Text>
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Star width={14} height={14} color={colors.warning} fill={colors.warning} />
            <Text style={styles.metaText}>{restaurant.rating}</Text>
          </View>
          <Text style={styles.metaText}>{restaurant.cuisine}</Text>
          <Text style={styles.metaText}>{restaurant.priceRange}</Text>
        </View>
        <View style={styles.cardLocation}>
          <MapPin width={12} height={12} color={colors.textSecondary} />
          <Text style={styles.locationText}>{restaurant.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderActivity = (activity: Activity) => (
    <TouchableOpacity key={activity.id} style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{activity.category}</Text>
        </View>
        <Text style={styles.cardTitle}>{activity.name}</Text>
        <Text style={styles.cardDescription}>{activity.description}</Text>
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Star width={14} height={14} color={colors.warning} fill={colors.warning} />
            <Text style={styles.metaText}>{activity.rating}</Text>
          </View>
          <View style={styles.metaItem}>
            <DollarSign width={14} height={14} color={colors.primary} />
            <Text style={styles.metaText}>${activity.price}</Text>
          </View>
          <Text style={styles.metaText}>{activity.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Places</Text>
        <View style={styles.searchContainer}>
          <Search width={20} height={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search destination..."
            value={destination}
            onChangeText={setDestination}
            onSubmitEditing={loadData}
          />
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'hotels' && styles.tabActive]}
          onPress={() => setSelectedTab('hotels')}
        >
          <Text style={[styles.tabText, selectedTab === 'hotels' && styles.tabTextActive]}>
            Hotels
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'restaurants' && styles.tabActive]}
          onPress={() => setSelectedTab('restaurants')}
        >
          <Text style={[styles.tabText, selectedTab === 'restaurants' && styles.tabTextActive]}>
            Restaurants
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'activities' && styles.tabActive]}
          onPress={() => setSelectedTab('activities')}
        >
          <Text style={[styles.tabText, selectedTab === 'activities' && styles.tabTextActive]}>
            Activities
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading {selectedTab}...</Text>
          </View>
        ) : (
          <>
            {selectedTab === 'hotels' && hotels.map(renderHotel)}
            {selectedTab === 'restaurants' && restaurants.map(renderRestaurant)}
            {selectedTab === 'activities' && activities.map(renderActivity)}
          </>
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
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...(typography.h2 as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...(typography.body as TextStyle),
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.primary,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  loadingText: {
    ...(typography.body as TextStyle),
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardContent: {
    padding: spacing.lg,
  },
  cardTitle: {
    ...(typography.h4 as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  cardDescription: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textPrimary,
    fontWeight: '600',
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  locationText: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textSecondary,
    flex: 1,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  amenityChip: {
    backgroundColor: colors.primaryLight + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  amenityText: {
    ...(typography.caption as TextStyle),
    color: colors.primary,
    fontWeight: '600',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  categoryText: {
    ...(typography.caption as TextStyle),
    color: colors.white,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
