import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Plus, Trash2 } from 'react-native-feather';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/colors';

export interface Place {
  id: string;
  name: string;
  city: string;
  type: 'hotel' | 'restaurant' | 'attraction' | 'transport';
}

interface ItineraryPlacesFormProps {
  onPlacesSubmit: (places: Array<{ name: string; city: string; type: string }>) => void;
  isLoading?: boolean;
}

const PLACE_TYPES = ['hotel', 'restaurant', 'attraction', 'transport'] as const;

export function ItineraryPlacesForm({
  onPlacesSubmit,
  isLoading = false,
}: ItineraryPlacesFormProps) {
  const [places, setPlaces] = useState<Place[]>([
    { id: '1', name: '', city: '', type: 'attraction' },
  ]);

  const handleAddPlace = () => {
    setPlaces([
      ...places,
      {
        id: Date.now().toString(),
        name: '',
        city: '',
        type: 'attraction',
      },
    ]);
  };

  const handleRemovePlace = (id: string) => {
    if (places.length > 1) {
      setPlaces(places.filter(p => p.id !== id));
    }
  };

  const handleUpdatePlace = (
    id: string,
    field: 'name' | 'city' | 'type',
    value: string
  ) => {
    setPlaces(
      places.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  const handleSubmit = () => {
    // Validate places
    const validPlaces = places.filter(p => p.name.trim() && p.city.trim());
    
    if (validPlaces.length === 0) {
      Alert.alert('Error', 'Please enter at least one place with name and city');
      return;
    }

    console.log('📍 Submitting places:', validPlaces);
    onPlacesSubmit(
      validPlaces.map(p => ({
        name: p.name.trim(),
        city: p.city.trim(),
        type: p.type,
      }))
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Places to Your Itinerary</Text>
      <Text style={styles.subtitle}>Enter locations you want to visit or stay at</Text>

      <ScrollView style={styles.placesContainer} showsVerticalScrollIndicator={false}>
        {places.map((place, index) => (
          <View key={place.id} style={styles.placeCard}>
            <View style={styles.placeHeader}>
              <Text style={styles.placeNumber}>Place {index + 1}</Text>
              {places.length > 1 && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleRemovePlace(place.id)}
                >
                  <Trash2 width={18} height={18} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>

            {/* Place Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Place Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Eiffel Tower, Hotel Plaza"
                value={place.name}
                onChangeText={(text) => handleUpdatePlace(place.id, 'name', text)}
                editable={!isLoading}
              />
            </View>

            {/* City */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Paris, Tokyo"
                value={place.city}
                onChangeText={(text) => handleUpdatePlace(place.id, 'city', text)}
                editable={!isLoading}
              />
            </View>

            {/* Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Place Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.typeButtonsContainer}>
                  {PLACE_TYPES.map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        place.type === type && styles.typeButtonActive,
                      ]}
                      onPress={() => handleUpdatePlace(place.id, 'type', type)}
                      disabled={isLoading}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          place.type === type && styles.typeButtonTextActive,
                        ]}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Place Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddPlace}
        disabled={isLoading}
      >
        <Plus width={20} height={20} color={colors.primary} />
        <Text style={styles.addButtonText}>Add Another Place</Text>
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.submitButtonText}>
          {isLoading ? 'Loading Map...' : 'View on Map'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  placesContainer: {
    flex: 1,
    marginBottom: spacing.lg,
  },
  placeCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  placeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  placeNumber: {
    fontSize: typography.h3.fontSize,
    fontWeight: '600',
    color: colors.primary,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  typeButtonsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  typeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: typography.caption.fontSize,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: colors.white,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  addButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.white,
  },
});
