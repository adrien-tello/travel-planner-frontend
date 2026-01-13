import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin, Clock, DollarSign, Star, ArrowLeft } from "react-native-feather";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing, typography, borderRadius, shadows } from "../../theme/colors";
import { GradientButton } from "../../components/GradientButton";
import { aiTripApi, TripSuggestion } from "../../api/ai-trip.api";
import { showToast } from "../../utils/toast";

export default function AITripSuggestionsScreen({ navigation }: any) {
  const [suggestions, setSuggestions] = useState<TripSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTripSuggestions();
  }, []);

  const loadTripSuggestions = async () => {
    try {
      const tripSuggestions = await aiTripApi.getTripSuggestions();
      setSuggestions(tripSuggestions);
    } catch (error: any) {
      showToast({
        type: "error",
        text1: "Failed to Load Suggestions",
        text2: error.response?.data?.message || "Please try again later"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTrip = (suggestion: TripSuggestion) => {
    navigation.navigate("TripDetail", { trip: suggestion });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Trip Suggestions</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Based on your preferences, here are personalized trip suggestions ✨
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Generating personalized suggestions...</Text>
          </View>
        ) : (
          <View style={styles.suggestionsContainer}>
            {suggestions.map((suggestion) => (
              <View key={suggestion.id} style={styles.suggestionCard}>
                <LinearGradient
                  colors={colors.gradientTravel}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardHeader}
                >
                  <View style={styles.destinationInfo}>
                    <Text style={styles.destinationName}>{suggestion.destination}</Text>
                    <Text style={styles.countryName}>{suggestion.country}</Text>
                  </View>
                  <View style={styles.matchScore}>
                    <Star width={16} height={16} color={colors.white} fill={colors.white} />
                    <Text style={styles.matchText}>{suggestion.matchScore}% Match</Text>
                  </View>
                </LinearGradient>

                <View style={styles.cardContent}>
                  <View style={styles.tripDetails}>
                    <View style={styles.detailItem}>
                      <Clock width={16} height={16} color={colors.primary} />
                      <Text style={styles.detailText}>{suggestion.duration} days</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <DollarSign width={16} height={16} color={colors.primary} />
                      <Text style={styles.detailText}>${suggestion.estimatedBudget}</Text>
                    </View>
                  </View>

                  <Text style={styles.sectionTitle}>Highlights</Text>
                  <View style={styles.highlightsList}>
                    {suggestion.highlights.map((highlight, index) => (
                      <Text key={index} style={styles.highlightItem}>• {highlight}</Text>
                    ))}
                  </View>

                  <Text style={styles.sectionTitle}>Activities</Text>
                  <View style={styles.activitiesList}>
                    {suggestion.activities.map((activity, index) => (
                      <View key={index} style={styles.activityTag}>
                        <Text style={styles.activityText}>{activity}</Text>
                      </View>
                    ))}
                  </View>

                  <GradientButton
                    title="View Details"
                    onPress={() => handleSelectTrip(suggestion)}
                    gradient={colors.gradientPurple}
                    style={styles.planButton}
                  />
                </View>
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
    paddingHorizontal: spacing.lg,
  },
  subtitle: {
    ...(typography.body as TextStyle),
    color: colors.textSecondary,
    textAlign: "center",
    marginVertical: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxxl,
  },
  loadingText: {
    ...(typography.body as TextStyle),
    color: colors.textSecondary,
  },
  suggestionsContainer: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  suggestionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationName: {
    ...(typography.h3 as TextStyle),
    color: colors.white,
    marginBottom: spacing.xs,
  },
  countryName: {
    ...(typography.body as TextStyle),
    color: "rgba(255, 255, 255, 0.9)",
  },
  matchScore: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  matchText: {
    ...(typography.bodySmall as TextStyle),
    color: colors.white,
    fontWeight: "600",
  },
  cardContent: {
    padding: spacing.lg,
  },
  tripDetails: {
    flexDirection: "row",
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  detailText: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    fontWeight: "600",
  },
  sectionTitle: {
    ...(typography.h4 as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  highlightsList: {
    marginBottom: spacing.lg,
  },
  highlightItem: {
    ...(typography.body as TextStyle),
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  activitiesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  activityTag: {
    backgroundColor: colors.primaryLight + "15",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  activityText: {
    ...(typography.bodySmall as TextStyle),
    color: colors.primary,
    fontWeight: "600",
  },
  planButton: {
    marginTop: spacing.sm,
  },
});