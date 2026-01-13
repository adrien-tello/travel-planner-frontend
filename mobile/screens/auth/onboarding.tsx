import { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextStyle } from "react-native"
import { Zap, DollarSign, Compass } from "react-native-feather"
import { LinearGradient } from "expo-linear-gradient"
import { useAuth } from "../../context/AuthContext"
import { colors, spacing, typography, borderRadius, shadows } from "../../theme/colors"
import { GradientButton } from "../../components/GradientButton"
import { showToast } from "../../utils/toast"
import { preferencesApi } from "../../api/preferences.api"

export default function OnboardingScreen({ navigation }: any) {
  const { completeOnboarding } = useAuth()
  const [step, setStep] = useState(1)
  const [preferences, setPreferences] = useState({
    budget: "moderate",
    pace: "moderate",
  })

  const budgetOptions = [
    { id: "budget", label: "Budget Friendly", icon: "💰", description: "Smart spending, more adventures" },
    { id: "moderate", label: "Moderate", icon: "💳", description: "Balance comfort and value" },
    { id: "luxury", label: "Luxury", icon: "💎", description: "Premium experiences" },
  ]

  const paceOptions = [
    { id: "relaxed", label: "Relaxed", icon: "🌴", description: "Take it slow, enjoy the moment" },
    { id: "moderate", label: "Balanced", icon: "⚖️", description: "Mix of activities and rest" },
    { id: "fast", label: "Fast-Paced", icon: "⚡", description: "See and do everything" },
  ]

  const handleNext = async () => {
    if (step === 2) {
      try {
        await preferencesApi.savePreferences({
          travelStyle: preferences.pace as 'relaxed' | 'moderate' | 'packed',
          budgetRange: preferences.budget as 'low' | 'mid' | 'high',
          interests: ['culture', 'food'], // Default interests
          groupSize: 1,
          travelWithKids: false,
        });
        
        await completeOnboarding();
        
        showToast({
          type: "success",
          text1: "Setup Complete! 🎉",
          text2: "Welcome to your personalized travel experience"
        });
        
        navigation.navigate("Home");
      } catch (error: any) {
        showToast({
          type: "error",
          text1: "Setup Failed",
          text2: error.response?.data?.message || "Failed to save preferences"
        });
      }
    } else {
      setStep(step + 1);
    }
  }

  const currentOptions = step === 1 ? budgetOptions : paceOptions
  const currentSelection = step === 1 ? preferences.budget : preferences.pace
  const IconComponent = step === 1 ? DollarSign : Compass

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={colors.gradientTravel}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.iconContainer}>
            <Zap width={28} height={28} color={colors.white} strokeWidth={2.5} />
          </View>
          <Text style={styles.title}>Personalize Your Experience</Text>
          <Text style={styles.subtitle}>Help our AI understand your travel style</Text>
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.stepHeader}>
            <View style={styles.stepIconContainer}>
              <IconComponent width={32} height={32} color={colors.primary} strokeWidth={2} />
            </View>
            <Text style={styles.question}>
              {step === 1 ? "What's your travel budget?" : "What's your travel pace?"}
            </Text>
            <Text style={styles.stepIndicator}>Step {step} of 2</Text>
          </View>

          <View style={styles.optionsContainer}>
            {currentOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionCard, currentSelection === option.id && styles.optionCardSelected]}
                onPress={() =>
                  setPreferences({
                    ...preferences,
                    [step === 1 ? "budget" : "pace"]: option.id,
                  })
                }
                activeOpacity={0.7}
              >
                <Text style={styles.optionEmoji}>{option.icon}</Text>
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionLabel,
                      currentSelection === option.id && styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <View style={[styles.radio, currentSelection === option.id && styles.radioSelected]}>
                  {currentSelection === option.id && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.progressContainer}>
            {[1, 2].map((i) => (
              <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive]} />
            ))}
          </View>

          <GradientButton
            title={step === 2 ? "Get Started 🚀" : "Continue →"}
            onPress={handleNext}
            gradient={colors.gradientPurple}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: spacing.xxxl * 2,
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.xl,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
    ...shadows.xl,
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
  },
  stepHeader: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  stepIconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primaryLight + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  question: {
    ...(typography.h3 as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  stepIndicator: {
    ...(typography.caption as TextStyle),
    color: colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  optionsContainer: {
    gap: spacing.md,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.md,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + "10",
  },
  optionEmoji: {
    fontSize: 32,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    ...(typography.h4 as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  optionLabelSelected: {
    color: colors.primary,
  },
  optionDescription: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textSecondary,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.xl,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.divider,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
    width: 32,
  },
})