import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  TextStyle,
  ScrollView,
} from "react-native"
import { Plus, Search, MapPin, Edit2, Trash2, Zap } from "react-native-feather"
import { useTripStore } from "../../store/tripStore"
import { useTripPlannerStore } from "../../store/tripPlannerStore"
import { colors, spacing, typography, borderRadius, shadows } from "../../theme/colors"
import { AIPreferencesModal } from "../../components/AIPreferencesModal"
import { PersonalizationIndicator } from "../../components/PersonalizationIndicator"
import { LocationStatus } from "../../components/LocationStatus"
import { Card } from "../../components/Card"
import { LinearGradient } from "expo-linear-gradient"
import { SafeAreaView } from "react-native-safe-area-context"
import { preferencesApi } from "../../api/preferences.api"
import { showToast } from "../../utils/toast"
import { useTheme } from "../../context/ThemeContext"

export default function HomeScreen({ navigation }: any) {
  const trips = useTripStore((state) => state.trips)
  const deleteTrip = useTripStore((state) => state.deleteTrip)
  const loadTrips = useTripStore((state) => state.loadTrips)
  const loading = useTripStore((state) => state.loading)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAIModal, setShowAIModal] = useState(false)
  const [showAIFeatures, setShowAIFeatures] = useState(false)
  const [userPreferences, setUserPreferences] = useState<any>(null)
  const { colors } = useTheme()
  
  const { 
    currentPlan, 
    generateTripPlan,
    isGenerating 
  } = useTripPlannerStore()

  useEffect(() => {
    loadUserPreferences()
    loadTrips()
  }, [])

  const loadUserPreferences = async () => {
    try {
      const preferences = await preferencesApi.getPreferences()
      setUserPreferences(preferences)
      setShowAIFeatures(true)
    } catch (error) {
      console.log('No preferences found, user needs to set them up')
    }
  }

  const handleAIPreferencesComplete = async (preferences: any) => {
    console.log('Preference data ', preferences)
    try {
      await preferencesApi.savePreferences(preferences)
      setUserPreferences(preferences)
      setShowAIFeatures(true)
      showToast({
        type: "success",
        text1: "Preferences Saved! ✨",
        text2: "Your travel style has been updated"
      })
    } catch (error: any) {
      showToast({
        type: "error",
        text1: "Save Failed",
        text2: error.response?.data?.message || "Failed to save preferences"
      })
    }
  }

  return (
    <SafeAreaView
    style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Welcome Back! 👋</Text>
          <Text style={styles.subtitle}>Ready for your next adventure?</Text>
        </View>
        <View style={styles.headerIcon}>
          <MapPin width={24} height={24} color={colors.white} strokeWidth={2} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Location Status Card */}
        <Card style={styles.locationStatusCard}>
          <Text style={styles.locationStatusTitle}>Travel Status</Text>
          <LocationStatus showWeather={true} />
        </Card>

        {/* AI Feature Card with Plus Button */}
        <View style={styles.aiSection}>
          <TouchableOpacity 
            activeOpacity={0.8} 
            style={styles.aiCard}
            onPress={() => navigation.navigate("AITripSuggestions")}
          >
            <LinearGradient
              colors={colors.gradientMagic}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiCardGradient}
            >
              <View style={styles.aiCardContent}>
                <View style={styles.aiIconContainer}>
                  <Zap width={28} height={28} color={colors.white} strokeWidth={2} />
                </View>
                <View style={styles.aiTextContainer}>
                  <Text style={styles.aiCardTitle}>AI Trip Planner ✨</Text>
                  <Text style={styles.aiCardSubtitle}>Let AI create your perfect itinerary based on your preferences</Text>
                </View>
              </View>
              
              {userPreferences && (
                <View style={styles.aiFeatures}>
                  <View style={styles.aiFeature}>
                    <Text style={styles.aiFeatureIcon}>🎯</Text>
                    <Text style={styles.aiFeatureText}>Smart Budget Optimization</Text>
                  </View>
                  <View style={styles.aiFeature}>
                    <Text style={styles.aiFeatureIcon}>🌤️</Text>
                    <Text style={styles.aiFeatureText}>Weather-Aware Suggestions</Text>
                  </View>
                  <View style={styles.aiFeature}>
                    <Text style={styles.aiFeatureIcon}>💰</Text>
                    <Text style={styles.aiFeatureText}>Real-Time Price Tracking</Text>
                  </View>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
          
          
        </View>

            {userPreferences && (
              <View style={styles.personalizationSection}>
                <PersonalizationIndicator 
                  score={85} 
                  label="Based on Your Preferences"
                  showProgress={true}
                />
                <Text style={styles.personalizationNote}>
                  AI is learning your travel style • Budget: {userPreferences.budgetRange} • Style: {userPreferences.travelStyle}
                </Text>
              </View>
            )}

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Search width={20} height={20} color={colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search destinations..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate("Search")}
            activeOpacity={0.8}
          >
            <Text style={styles.searchButtonText}>Go</Text>
          </TouchableOpacity>
        </View>

        {/* Trips List or Empty State */}
        {trips.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <MapPin width={64} height={64} color={colors.primary} />
            </View>
            <Text style={styles.emptyText}>No Trips Yet</Text>
            <Text style={styles.emptySubtext}>Start planning your dream adventure with AI assistance</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate("CreateItinerary")}
              activeOpacity={0.8}
            >
              <Plus width={20} height={20} color={colors.white} />
              <Text style={styles.createButtonText}>Create Your First Trip</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.tripsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Trips</Text>
              <View style={styles.tripCount}>
                <Text style={styles.tripCountText}>{trips.length}</Text>
              </View>
            </View>

            <FlatList
              data={trips}
              renderItem={({ item }) => (
                <View style={styles.tripCard}>
                  <TouchableOpacity
                    onPress={() => {
                      const trip = useTripStore.getState().getTrip(item.id);
                      if (trip?.itinerary) {
                        navigation.navigate("DetailedItinerary", { itinerary: trip.itinerary });
                      } else {
                        navigation.navigate("ItineraryDetail", { id: item.id });
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.tripHeader}>
                      <View style={styles.tripDestination}>
                        <MapPin width={20} height={20} color={colors.primary} />
                        <Text style={styles.tripTitle}>{item.destination}</Text>
                      </View>
                    </View>
                    <Text style={styles.tripDate}>
                      {item.startDate} → {item.endDate}
                    </Text>
                    {item.budget && (
                      <Text style={styles.tripBudget}>Budget: ${item.budget}</Text>
                    )}
                  </TouchableOpacity>

                  <View style={styles.tripActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => navigation.navigate("CreateItinerary", { tripId: item.id })}
                      activeOpacity={0.7}
                    >
                      <Edit2 width={16} height={16} color={colors.primary} />
                      <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, { borderRightWidth: 0 }]}
                      onPress={() => deleteTrip(item.id)}
                      activeOpacity={0.7}
                    >
                      <Trash2 width={16} height={16} color={colors.error} />
                      <Text style={[styles.actionButtonText, { color: colors.error }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.tripsList}
              scrollEnabled={false}
            />
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.quickCreateButton, { backgroundColor: colors.surface, shadowColor: colors.black }]}
          onPress={() => navigation.navigate("CreateItinerary")}
          activeOpacity={0.8}
        >
          <Plus width={24} height={24} color={colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.quickCreateButton, { backgroundColor: colors.surface, shadowColor: colors.black }]}
          onPress={() => navigation.navigate("MapPlanner")}
          activeOpacity={0.8}
        >
          <MapPin width={24} height={24} color={colors.secondary} strokeWidth={2.5} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("AITripSuggestions")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={colors.gradientPurple}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabGradient}
          >
            <Zap width={28} height={28} color={colors.white} strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <AIPreferencesModal
        visible={showAIModal}
        onClose={() => setShowAIModal(false)}
        onComplete={handleAIPreferencesComplete}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    ...shadows.lg,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    ...(typography.h2 as TextStyle),
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...(typography.body as TextStyle),
    color: "rgba(255, 255, 255, 0.95)",
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  locationStatusCard: {
    marginBottom: spacing.lg,
  },
  locationStatusTitle: {
    ...(typography.h4 as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  aiSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  aiCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.xl,
  },
  quickCreateButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  aiCardGradient: {
    padding: spacing.lg,
  },
  aiCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  aiIconContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  aiTextContainer: {
    flex: 1,
  },
  aiCardTitle: {
    ...(typography.h4 as TextStyle),
    color: colors.white,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  aiCardSubtitle: {
    ...(typography.bodySmall as TextStyle),
    color: "rgba(255, 255, 255, 0.95)",
    lineHeight: 20,
  },
  aiFeatures: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  aiFeature: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  aiFeatureIcon: {
    fontSize: 16,
  },
  aiFeatureText: {
    ...(typography.bodySmall as TextStyle),
    color: colors.white,
    fontWeight: "600",
  },
  personalizationSection: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  personalizationNote: {
    ...(typography.caption as TextStyle),
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
  },
  searchContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xl,
    justifyContent: "center",
    ...shadows.md,
  },
  searchButtonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primaryLight + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  emptyText: {
    ...(typography.h3 as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...(typography.body as TextStyle),
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
  },
  createButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    minWidth: 250,
    ...shadows.colored(colors.primary),
  },
  createButtonText: {
    ...(typography.body as TextStyle),
    color: colors.white,
    fontWeight: "700",
  },
  tripsSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...(typography.h3 as TextStyle),
    color: colors.textPrimary,
  },
  tripCount: {
    backgroundColor: colors.primaryLight + "15",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  tripCountText: {
    ...(typography.body as TextStyle),
    color: colors.primary,
    fontWeight: "700",
  },
  tripsList: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  tripCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...shadows.lg,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  tripDestination: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  tripTitle: {
    ...(typography.h4 as TextStyle),
    color: colors.textPrimary,
  },
  tripDate: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textSecondary,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  tripBudget: {
    ...(typography.bodySmall as TextStyle),
    color: colors.primary,
    fontWeight: "600",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  tripActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  actionButtonText: {
    ...(typography.bodySmall as TextStyle),
    color: colors.primary,
    fontWeight: "600",
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    ...shadows.colored(colors.primary),
  },
  fabContainer: {
    position: "absolute",
    bottom: 100,
    right: spacing.lg,
    alignItems: "center",
    gap: spacing.md,
  },
  fabGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
})