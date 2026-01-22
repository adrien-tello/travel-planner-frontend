import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, FlatList, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, X } from 'react-native-feather';
import { ItineraryPlacesForm } from '../components/ItineraryPlacesForm';
import { ItineraryMap } from '../components/ItineraryMap';
import { MapboxGeocodingService } from '../services/mapbox-geocoding.service';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/colors';
import { showToast } from '../utils/toast';

export default function MapPlannerScreen({ navigation }: any) {
  const [selectedPlaces, setSelectedPlaces] = useState<Array<{ name: string; city: string; type: string }> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePlacesSubmit = async (places: Array<{ name: string; city: string; type: string }>) => {
    setIsLoading(true);
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      setSelectedPlaces(places);
    } catch (error) {
      console.error('Error processing places:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchPlace = async (query: string) => {
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSearching(true);
        const parts = query.split(',').map(p => p.trim());
        const placeName = parts[0];
        const city = parts[1] || '';

        if (!placeName) return;

        const result = await MapboxGeocodingService.searchPlaces(query);
        setSearchResults(result);
      } catch (error: any) {
        console.error('Search error:', error);
        showToast({
          type: 'error',
          text1: 'Search Failed',
          text2: 'Could not find location. Try searching with location name'
        });
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSelectSearchResult = (result: any) => {
    const newPlace = {
      name: result.name,
      city: result.address.split(',')[1]?.trim() || 'Unknown',
      type: result.type
    };
    
    if (selectedPlaces) {
      setSelectedPlaces([...selectedPlaces, newPlace]);
    } else {
      setSelectedPlaces([newPlace]);
    }
    
    setSearchQuery('');
    setSearchResults([]);
    
    showToast({
      type: 'success',
      text1: 'Location Added',
      text2: `${result.name} added to map`
    });
  };

  const handleBack = () => {
    if (selectedPlaces && selectedPlaces.length > 0) {
      // If viewing map, go back to form
      setSelectedPlaces(null);
    } else {
      // If on form, go back to home
      navigation.goBack();
    }
  };

  // If places are selected, show map view
  if (selectedPlaces && selectedPlaces.length > 0) {
    return (
      <SafeAreaView style={[styles.container, { flex: 1 }]} edges={['right', 'left']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft width={24} height={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Map View</Text>
        </View>

        {/* Search Bar in Map View */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Search width={20} height={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search places, hotels, restaurants..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearchPlace}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => { setSearchQuery(''); setSearchResults([]); }}>
                <X width={20} height={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <View style={styles.searchResultsDropdown}>
              <FlatList
                data={searchResults}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() => handleSelectSearchResult(item)}
                  >
                    <View>
                      <Text style={styles.resultName}>{item.name}</Text>
                      <Text style={styles.resultAddress}>{item.address}</Text>
                      <Text style={styles.resultCoords}>
                        {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {isSearching && (
            <View style={styles.loadingIndicator}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          )}
        </View>

        <View style={styles.mapContainer}>
          <ItineraryMap places={selectedPlaces} />
        </View>
      </SafeAreaView>
    );
  }

  // Show form to input places
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plan Your Route</Text>
      </View>
      <ItineraryPlacesForm onPlacesSubmit={handlePlacesSubmit} isLoading={isLoading} />
       <View style={{ height: 100 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  backButton: {
    padding: spacing.sm,
  },
  mapContainer: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 14,
    color: colors.textPrimary,
  },
  searchResultsDropdown: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 250,
    overflow: 'hidden',
  },
  resultItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  resultAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  resultCoords: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '500',
  },
  loadingIndicator: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
});
