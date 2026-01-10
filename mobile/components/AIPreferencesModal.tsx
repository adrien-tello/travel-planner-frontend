import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextStyle,
} from "react-native"
import { X, Zap } from "react-native-feather"
import { LinearGradient } from "expo-linear-gradient"
import { colors, spacing, typography, borderRadius, shadows } from "../theme/colors"
import { GradientButton } from "./GradientButton"
import { UserPreferences } from "../store/tripPlannerStore"

interface AIPreferencesModalProps {
  visible: boolean
  onClose: () => void
  onComplete: (preferences: UserPreferences) => void
}

export const AIPreferencesModal: React.FC<AIPreferencesModalProps> = ({
  visible,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState(1)
  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: "moderate",
    pace: "moderate",
    interests: [],
    accommodation: "mid-range",
    dining: "mixed",
  })

  const budgetOptions = [
    { id: "budget", label: "Budget", icon: "💰", description: "Smart spending" },
    { id: "moderate", label: "Moderate", icon: "💳", description: "Balanced comfort" },
    { id: "luxury", label: "Luxury", icon: "💎", description: "Premium experience" },
  ]

  const paceOptions = [
    { id: "relaxed", label: "Relaxed", icon: "🌴", description: "Take it slow" },
    { id: "moderate", label: "Balanced", icon: "⚖️", description: "Mix activities & rest" },
    { id: "fast", label: "Fast-Paced", icon: "⚡", description: "See everything" },
  ]

  const interestOptions = [
    { id: "culture", label: "Culture", icon: "🎭" },
    { id: "food", label: "Food", icon: "🍜" },
    { id: "adventure", label: "Adventure", icon: "🏔️" },
    { id: "relaxation", label: "Relaxation", icon: "🧘" },
    { id: "shopping", label: "Shopping", icon: "🛍️" },
    { id: "nightlife", label: "Nightlife", icon: "🎉" },
  ]

  const accommodationOptions = [
    { id: "budget", label: "Budget", description: "Hostels & budget hotels" },
    { id: "mid-range", label: "Mid-Range", description: "Comfortable hotels" },
    { id: "luxury", label: "Luxury", description: "5-star hotels & resorts" },
  ]

  const diningOptions = [
    { id: "local", label: "Local Eats", description: "Street food & local spots" },
    { id: "mixed", label: "Mixed", description: "Variety of options" },
    { id: "fine-dining", label: "Fine Dining", description: "Premium restaurants" },
  ]

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      onComplete(preferences)
      onClose()
      setStep(1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const toggleInterest = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What's your travel budget? 💰</Text>
            <Text style={styles.stepDescription}>This helps us recommend suitable options</Text>
            {budgetOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  preferences.budget === option.id && styles.optionCardSelected
                ]}
                onPress={() => setPreferences({ ...preferences, budget: option.id as any })}
              >
                <Text style={styles.optionEmoji}>{option.icon}</Text>
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionLabel,
                    preferences.budget === option.id && styles.optionLabelSelected
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <View style={[
                  styles.radio,
                  preferences.budget === option.id && styles.radioSelected
                ]}>
                  {preferences.budget === option.id && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What's your travel pace? ⚡</Text>
            <Text style={styles.stepDescription}>How do you like to explore?</Text>
            {paceOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  preferences.pace === option.id && styles.optionCardSelected
                ]}
                onPress={() => setPreferences({ ...preferences, pace: option.id as any })}
              >
                <Text style={styles.optionEmoji}>{option.icon}</Text>
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionLabel,
                    preferences.pace === option.id && styles.optionLabelSelected
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <View style={[
                  styles.radio,
                  preferences.pace === option.id && styles.radioSelected
                ]}>
                  {preferences.pace === option.id && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What interests you? 🎯</Text>
            <Text style={styles.stepDescription}>Select all that apply</Text>
            <View style={styles.interestsGrid}>
              {interestOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.interestChip,
                    preferences.interests.includes(option.id) && styles.interestChipSelected
                  ]}
                  onPress={() => toggleInterest(option.id)}
                >
                  <Text style={styles.interestEmoji}>{option.icon}</Text>
                  <Text style={[
                    styles.interestLabel,
                    preferences.interests.includes(option.id) && styles.interestLabelSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Accommodation & Dining 🏨</Text>
            <Text style={styles.stepDescription}>Your preferences for stay and food</Text>
            
            <Text style={styles.sectionLabel}>Accommodation</Text>
            {accommodationOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  preferences.accommodation === option.id && styles.optionCardSelected
                ]}
                onPress={() => setPreferences({ ...preferences, accommodation: option.id as any })}
              >
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionLabel,
                    preferences.accommodation === option.id && styles.optionLabelSelected
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <View style={[
                  styles.radio,
                  preferences.accommodation === option.id && styles.radioSelected
                ]}>
                  {preferences.accommodation === option.id && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}

            <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>Dining</Text>
            {diningOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  preferences.dining === option.id && styles.optionCardSelected
                ]}
                onPress={() => setPreferences({ ...preferences, dining: option.id as any })}
              >
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionLabel,
                    preferences.dining === option.id && styles.optionLabelSelected
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <View style={[
                  styles.radio,
                  preferences.dining === option.id && styles.radioSelected
                ]}>
                  {preferences.dining === option.id && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )

      default:
        return null
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <LinearGradient
            colors={colors.gradientPurple}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <Zap width={24} height={24} color={colors.white} strokeWidth={2} />
                <Text style={styles.headerTitle}>AI Trip Planner</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X width={24} height={24} color={colors.white} strokeWidth={2} />
              </TouchableOpacity>
            </View>
            
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              {[1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.progressDot,
                    i <= step && styles.progressDotActive
                  ]}
                />
              ))}
            </View>
            <Text style={styles.stepIndicator}>Step {step} of 4</Text>
          </LinearGradient>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {renderStepContent()}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            {step > 1 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            <GradientButton
              title={step === 4 ? "Generate Trip Plan ✨" : "Continue"}
              onPress={handleNext}
              gradient={colors.gradientPurple}
              style={styles.nextButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    height: "90%",
    ...shadows.xl,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  headerTitle: {
    ...(typography.h3 as TextStyle),
    color: colors.white,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  progressDotActive: {
    backgroundColor: colors.white,
    width: 32,
  },
  stepIndicator: {
    ...(typography.caption as TextStyle),
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.xl,
  },
  stepContent: {
    gap: spacing.md,
  },
  stepTitle: {
    ...(typography.h2 as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  stepDescription: {
    ...(typography.body as TextStyle),
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...(typography.h4 as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.md,
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
    marginBottom: spacing.md,
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
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  interestChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
  },
  interestChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + "15",
  },
  interestEmoji: {
    fontSize: 20,
  },
  interestLabel: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textPrimary,
    fontWeight: "600",
  },
  interestLabelSelected: {
    color: colors.primary,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    fontWeight: "700",
  },
  nextButton: {
    flex: 2,
  },
})