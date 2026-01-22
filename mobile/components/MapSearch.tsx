import React, { useState, useCallback } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Search, MapPin, X } from 'react-native-feather';
import { MapboxGeocodingService, SearchResult } from '../services/mapbox-geocoding.service';
import { colors, spacing, typography, borderRadius } from '../theme/colors';
import { showToast } from '../utils/toast';

interface MapSearchProps {
  onLocationSelect: (location: { name: string; latitude: number; longitude: number; type: string }) => void;
  placeholder?: string;
}

export const MapSearch: React.FC<MapSearchProps> = ({ 
  onLocationSelect, 
  placeholder = "Search places, hotels, restaurants..." 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchPlaces = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await MapboxGeocodingService.searchPlaces(searchQuery);
      setResults(searchResults);
      setShowResults(true);
    } catch (error) {
      showToast({
        type: 'error',
        text1: 'Search Failed',
        text2: 'Unable to search locations'
      });
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleTextChange = useCallback((text: string) => {
    setQuery(text);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      searchPlaces(text);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchPlaces]);

  const handleSelectResult = (result: SearchResult) => {
    onLocationSelect({
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      type: result.type
    });
    
    setQuery(result.name);
    setShowResults(false);
    
    showToast({
      type: 'success',
      text1: 'Location Added',
      text2: `${result.name} added to map`
    });
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search width={20} height={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={handleTextChange}
          onFocus={() => query.length > 1 && setShowResults(true)}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <X width={18} height={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {showResults && (
        <View style={styles.resultsContainer}>
          {isSearching ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : results.length > 0 ? (
            <FlatList
              data={results}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => handleSelectResult(item)}
                >
                  <MapPin width={16} height={16} color={colors.primary} />
                  <View style={styles.resultContent}>
                    <Text style={styles.resultName}>{item.name}</Text>
                    <Text style={styles.resultAddress}>{item.address}</Text>
                    <Text style={styles.resultCoords}>
                      {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              style={styles.resultsList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No places found</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    fontSize: 16,
    color: colors.textPrimary,
  },
  clearButton: {
    padding: spacing.xs,
  },
  resultsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
  },
  resultsList: {
    maxHeight: 300,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  resultAddress: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  resultCoords: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  noResultsContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  noResultsText: {
    color: colors.textSecondary,
  },
});