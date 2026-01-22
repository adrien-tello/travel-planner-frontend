import React, { useState, useEffect } from "react"
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  View,
  TextStyle,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MapPin, Calendar, DollarSign, Zap, Users, MessageCircle } from "react-native-feather"
import { LinearGradient } from "expo-linear-gradient"
import { useTripStore } from "../../store/tripStore"
import { colors, spacing, typography, borderRadius, shadows } from "../../theme/colors"
import { GradientButton } from "../../components/GradientButton"
import { TripMap } from "../../components/TripMap"
import { itineraryApi } from "../../api/itinerary.api"
import { preferencesApi } from "../../api/preferences.api"
import { showToast } from "../../utils/toast"

export default function CreateItineraryScreen({ navigation, route }: any) {
  const addTrip = useTripStore((state) => state.addTrip)
  const [destination, setDestination] = useState(route.params?.suggestion?.destination || "")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [budget, setBudget] = useState(route.params?.suggestion?.estimatedBudget?.toString() || "")
  const [duration, setDuration] = useState(route.params?.suggestion?.duration?.toString() || "5")
  const [tripDescription, setTripDescription] = useState("")
  const [travelers, setTravelers] = useState("2")
  const [isGenerating, setIsGenerating] = useState(false)
  const [userPreferences, setUserPreferences] = useState<any>(null)
  const [showMap, setShowMap] = useState(false)
  const [destinationCoords, setDestinationCoords] = useState<{latitude: number, longitude: number} | null>(null)

  useEffect(() => {
    loadUserPreferences()
  }, [])

  const loadUserPreferences = async () => {
    try {
      const preferences = await preferencesApi.getPreferences()
      setUserPreferences(preferences)
    } catch (error) {
      console.log('No preferences found')
    }
  }

  const handleCreate = async () => {
    if (!destination || !duration) {
      showToast({
        type: "error",
        text1: "Missing Information",
        text2: "Please fill in destination and duration"
      })
      return
    }

    if (!userPreferences) {
      showToast({
        type: "error",
        text1: "Missing Preferences",
        text2: "Please complete onboarding first"
      })
      return
    }

    setIsGenerating(true)
    try {
      // Generate comprehensive AI itinerary using all APIs
      const detailedItinerary = await itineraryApi.generateDetailedItinerary({
        destination: destination.trim(),
        duration: parseInt(duration),
        travelers: parseInt(travelers) || 1,
        budget: budget ? parseFloat(budget) : undefined,
        interests: userPreferences?.interests || [],
      })

      // Add trip to local store
      await addTrip({
        destination,
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || new Date(Date.now() + parseInt(duration) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        budget: budget || detailedItinerary.summary?.totalCost?.toString() || detailedItinerary.budget?.toString() || '0',
        itinerary: detailedItinerary,
      })

      showToast({
        type: "success",
        text1: "Trip Created! 🎉",
        text2: "Your AI-powered itinerary is ready"
      })

      // Navigate to detailed itinerary view
      navigation.navigate("DetailedItinerary", { itinerary: detailedItinerary })
    } catch (error: any) {
      showToast({
        type: "error",
        text1: "Generation Failed",
        text2: error.response?.data?.message || "Failed to create itinerary"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={colors.gradientTravel}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerIconContainer}>
          <Zap width={24} height={24} color={colors.white} strokeWidth={2.5} />
        </View>
        <Text style={styles.title}>Plan Your Trip 🗺️</Text>
        <Text style={styles.subtitle}>Let AI create your perfect itinerary</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Destination Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Destination</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <MapPin width={20} height={20} color={colors.primary} strokeWidth={2} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Where are you going?"
                placeholderTextColor={colors.textTertiary}
                value={destination}
                onChangeText={setDestination}
              />
            </View>
          </View>

          {/* Duration and Travelers Row */}
          <View style={styles.dateRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Duration (Days)</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Calendar width={20} height={20} color={colors.primary} strokeWidth={2} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="5"
                  placeholderTextColor={colors.textTertiary}
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Travelers</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Users width={20} height={20} color={colors.primary} strokeWidth={2} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="2"
                  placeholderTextColor={colors.textTertiary}
                  value={travelers}
                  onChangeText={setTravelers}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Trip Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tell AI About Your Trip (Optional)</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <View style={styles.inputIcon}>
                <MessageCircle width={20} height={20} color={colors.primary} strokeWidth={2} />
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g., Romantic getaway, family vacation, adventure trip..."
                placeholderTextColor={colors.textTertiary}
                value={tripDescription}
                onChangeText={setTripDescription}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Budget Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Budget (Optional)</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <DollarSign width={20} height={20} color={colors.primary} strokeWidth={2} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="AI will estimate based on your preferences"
                placeholderTextColor={colors.textTertiary}
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Map Preview */}
          {destination && showMap && destinationCoords && (
            <View style={styles.mapSection}>
              <Text style={styles.label}>Destination Preview</Text>
              <View style={styles.mapContainer}>
                <TripMap
                  locations={[
                    {
                      id: '1',
                      name: destination,
                      latitude: destinationCoords.latitude,
                      longitude: destinationCoords.longitude,
                      type: 'attraction',
                    },
                  ]}
                  centerCoordinate={[destinationCoords.longitude, destinationCoords.latitude]}
                  style={styles.map}
                />
              </View>
            </View>
          )}

          {/* AI Feature Card */}
          <TouchableOpacity style={styles.aiCard} activeOpacity={0.9}>
            <LinearGradient
              colors={colors.gradientPurple}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiCardGradient}
            >
              <View style={styles.aiCardContent}>
                <Zap width={24} height={24} color={colors.white} strokeWidth={2.5} />
                <Text style={styles.aiCardText}>
                  AI will analyze your preferences and create a personalized itinerary
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {userPreferences ? (
            <View style={styles.preferencesInfo}>
              <Text style={styles.preferencesTitle}>AI will use your preferences</Text>
              <Text style={styles.preferencesText}>
                Travel Style: {userPreferences.travelStyle} • Budget Range: {userPreferences.budgetRange}
              </Text>
              <Text style={styles.preferencesText}>
                Interests: {userPreferences.interests?.join(", ") || "Not specified"}
              </Text>
            </View>
          ) : (
            <View style={styles.noPreferencesCard}>
              <Zap width={24} height={24} color={colors.warning} strokeWidth={2} />
              <Text style={styles.noPreferencesText}>
                Complete onboarding to get personalized AI recommendations
              </Text>
            </View>
          )}

          <GradientButton
            title={isGenerating ? "Creating Your Trip..." : "Generate AI Itinerary ✨"}
            onPress={handleCreate}
            loading={isGenerating}
            gradient={colors.gradientMagic}
            style={styles.button}
          />
        </View>
        <View style={{ height: 100 }} />
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
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxxl,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
    alignItems: "center",
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    ...(typography.h2 as TextStyle),
    color: colors.white,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    ...(typography.body as TextStyle),
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  form: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  dateRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  label: {
    ...(typography.caption as TextStyle),
    color: colors.textPrimary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  inputIcon: {
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingRight: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
  },
  aiCard: {
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
    ...shadows.lg,
  },
  aiCardGradient: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  aiCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  aiCardText: {
    ...(typography.bodySmall as TextStyle),
    color: colors.white,
    flex: 1,
  },
  preferencesInfo: {
    backgroundColor: colors.primaryLight + "10",
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primaryLight + "30",
    marginTop: spacing.md,
  },
  preferencesTitle: {
    ...(typography.bodyMedium as TextStyle),
    color: colors.primary,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  preferencesText: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  changePreferences: {
    ...(typography.bodySmall as TextStyle),
    color: colors.primary,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  setPreferencesCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: "dashed",
    marginTop: spacing.md,
  },
  setPreferencesText: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    flex: 1,
  },
  button: {
    marginTop: spacing.md,
  },
  textAreaContainer: {
    alignItems: "flex-start",
    paddingVertical: spacing.sm,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  noPreferencesCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.warning + "10",
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.warning + "30",
    marginTop: spacing.md,
  },
  noPreferencesText: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    flex: 1,
  },
  mapSection: {
    gap: spacing.sm,
  },
  mapContainer: {
    height: 200,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  map: {
    flex: 1,
  },
})