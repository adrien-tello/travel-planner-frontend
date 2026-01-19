import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'react-native-feather';
import { ItineraryPlacesForm } from '../components/ItineraryPlacesForm';
import { ItineraryMap } from '../components/ItineraryMap';
import { colors, spacing } from '../theme/colors';

export default function MapPlannerScreen({ navigation }: any) {
  const [selectedPlaces, setSelectedPlaces] = useState<Array<{ name: string; city: string; type: string }> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      </View>
      <ItineraryPlacesForm onPlacesSubmit={handlePlacesSubmit} isLoading={isLoading} />
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
  },
  backButton: {
    padding: spacing.sm,
  },
  mapContainer: {
    flex: 1,
  },
});
