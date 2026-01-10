import React from "react"
import { View, Text, StyleSheet, TextStyle } from "react-native"
import { Star } from "react-native-feather"
import { LinearGradient } from "expo-linear-gradient"
import { colors, spacing, typography, borderRadius } from "../theme/colors"

interface PersonalizationIndicatorProps {
  score: number
  label?: string
  showProgress?: boolean
}

export const PersonalizationIndicator: React.FC<PersonalizationIndicatorProps> = ({
  score,
  label = "Personalization Match",
  showProgress = true,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Star width={16} height={16} color={colors.primary} strokeWidth={2} />
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.score}>{score}%</Text>
      </View>
      
      {showProgress && (
        <View style={styles.progressBar}>
          <LinearGradient
            colors={colors.gradientPurple as readonly [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${score}%` }]}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryLight + "10",
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primaryLight + "30",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  label: {
    ...(typography.caption as TextStyle),
    color: colors.primary,
    fontWeight: "600",
    flex: 1,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  score: {
    ...(typography.bodyMedium as TextStyle),
    color: colors.primary,
    fontWeight: "700",
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.primaryLight + "20",
    borderRadius: 2,
    marginTop: spacing.sm,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
})