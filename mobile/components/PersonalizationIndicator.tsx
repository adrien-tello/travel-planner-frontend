import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { colors, spacing, typography, borderRadius } from "../theme/colors"

interface PersonalizationIndicatorProps {
  score: number
  label: string
  showProgress?: boolean
}

export const PersonalizationIndicator: React.FC<PersonalizationIndicatorProps> = ({ 
  score, 
  label, 
  showProgress = false 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.score}>{score}%</Text>
      </View>
      
      {showProgress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${score}%` }]} />
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryLight + "15",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primaryLight + "30",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  score: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: "700",
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
  },
})