import { Text, StyleSheet, ScrollView, View, TextStyle } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MapPin, Calendar, DollarSign, Clock } from "react-native-feather"
import { LinearGradient } from "expo-linear-gradient"
import { colors, spacing, typography, borderRadius, shadows } from "../../theme/colors"
import { Card } from "../../components/Card"

export default function ItineraryDetailScreen({ route }: any) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={colors.gradientOcean}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.destination}>Paris, France</Text>
        <Text style={styles.duration}>7 Days Trip</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trip Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Calendar width={20} height={20} color={colors.primary} strokeWidth={2} />
              <View style={styles.summaryText}>
                <Text style={styles.summaryLabel}>Dates</Text>
                <Text style={styles.summaryValue}>May 15 - May 22</Text>
              </View>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <DollarSign width={20} height={20} color={colors.primary} strokeWidth={2} />
              <View style={styles.summaryText}>
                <Text style={styles.summaryLabel}>Budget</Text>
                <Text style={styles.summaryValue}>$3,500</Text>
              </View>
            </View>
            <View style={styles.summaryItem}>
              <Clock width={20} height={20} color={colors.primary} strokeWidth={2} />
              <View style={styles.summaryText}>
                <Text style={styles.summaryLabel}>Duration</Text>
                <Text style={styles.summaryValue}>7 Days</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* AI Generated Badge */}
        <View style={styles.aiBadgeContainer}>
          <LinearGradient
            colors={colors.gradientPurple}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.aiBadge}
          >
            <Text style={styles.aiBadgeText}>✨ AI Generated Itinerary</Text>
          </LinearGradient>
        </View>

        {/* Coming Soon Message */}
        <Card style={styles.comingSoonCard}>
          <MapPin width={48} height={48} color={colors.primary} strokeWidth={1.5} />
          <Text style={styles.comingSoonTitle}>Detailed Itinerary Coming Soon!</Text>
          <Text style={styles.comingSoonText}>
            Our AI is working on creating the perfect day-by-day itinerary with activities, restaurants,
            and travel tips.
          </Text>
        </Card>
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
  destination: {
    ...(typography.h1 as TextStyle),
    color: colors.white,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  duration: {
    ...(typography.body as TextStyle),
    color: "rgba(255, 255, 255, 0.9)",
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  summaryItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  summaryText: {
    flex: 1,
  },
  summaryLabel: {
    ...(typography.caption as TextStyle),
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryValue: {
    ...(typography.bodyMedium as TextStyle),
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  aiBadgeContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  aiBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    ...shadows.md,
  },
  aiBadgeText: {
    ...(typography.bodyMedium as TextStyle),
    color: colors.white,
    fontWeight: "700",
  },
  comingSoonCard: {
    alignItems: "center",
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  comingSoonTitle: {
    ...(typography.h3 as TextStyle),
    color: colors.textPrimary,
    textAlign: "center",
  },
  comingSoonText: {
    ...(typography.body as TextStyle),
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
})