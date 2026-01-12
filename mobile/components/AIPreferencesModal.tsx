import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextStyle,
} from "react-native"
import { X, Check } from "react-native-feather"
import { LinearGradient } from "expo-linear-gradient"
import { colors, spacing, typography, borderRadius, shadows } from "../theme/colors"
import { GradientButton } from "./GradientButton"

interface AIPreferencesModalProps {
  visible: boolean
  onClose: () => void
  onComplete: (preferences: any) => void
}

export const AIPreferencesModal: React.FC<AIPreferencesModalProps> = ({
  visible,
  onClose,
  onComplete,
}) => {
  const [travelStyle, setTravelStyle] = useState("")
  const [budgetRange, setBudgetRange] = useState("")
  const [interests, setInterests] = useState<string[]>([])

  const travelStyles = [
    { id: "budget", label: "Budget Traveler", desc: "Cost-effective options" },
    { id: "moderate", label: "Moderate", desc: "Balance of comfort & cost" },
    { id: "luxury", label: "Luxury", desc: "Premium experiences" },
  ]

  const budgetRanges = [
    { id: "low", label: "$0-50/day", desc: "Budget-friendly" },
    { id: "medium", label: "$50-150/day", desc: "Mid-range" },
    { id: "high", label: "$150+/day", desc: "Premium" },
  ]

  const interestOptions = [
    "Culture & History",
    "Food & Dining",
    "Adventure Sports",
    "Nature & Wildlife",
    "Art & Museums",
    "Nightlife",
    "Shopping",
    "Photography",
  ]

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const handleComplete = () => {
    onComplete({
      travelStyle,
      budgetRange,
      interests,
    })
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <LinearGradient
          colors={colors.gradientPurple}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X width={24} height={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Set Your Preferences</Text>
          <Text style={styles.subtitle}>Help AI personalize your trips</Text>
        </LinearGradient>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Travel Style</Text>
            {travelStyles.map(style => (
              <TouchableOpacity
                key={style.id}
                style={[
                  styles.option,
                  travelStyle === style.id && styles.optionSelected,
                ]}
                onPress={() => setTravelStyle(style.id)}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionLabel}>{style.label}</Text>
                  <Text style={styles.optionDesc}>{style.desc}</Text>
                </View>
                {travelStyle === style.id && (
                  <Check width={20} height={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Budget Range</Text>
            {budgetRanges.map(budget => (
              <TouchableOpacity
                key={budget.id}
                style={[
                  styles.option,
                  budgetRange === budget.id && styles.optionSelected,
                ]}
                onPress={() => setBudgetRange(budget.id)}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionLabel}>{budget.label}</Text>
                  <Text style={styles.optionDesc}>{budget.desc}</Text>
                </View>
                {budgetRange === budget.id && (
                  <Check width={20} height={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsGrid}>
              {interestOptions.map(interest => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.interestChip,
                    interests.includes(interest) && styles.interestChipSelected,
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text
                    style={[
                      styles.interestText,
                      interests.includes(interest) && styles.interestTextSelected,
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <GradientButton
            title="Save Preferences"
            onPress={handleComplete}
            gradient={colors.gradientPurple}
            style={styles.saveButton}
            disabled={!travelStyle || !budgetRange}
          />
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: spacing.xxxl,
    right: spacing.lg,
    padding: spacing.sm,
  },
  title: {
    ...(typography.h2 as TextStyle),
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...(typography.body as TextStyle),
    color: "rgba(255, 255, 255, 0.9)",
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...(typography.h3 as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + "10",
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    ...(typography.body as TextStyle),
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  optionDesc: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textSecondary,
  },
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  interestChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  interestChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  interestText: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textPrimary,
    fontWeight: "600",
  },
  interestTextSelected: {
    color: colors.white,
  },
  saveButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
})