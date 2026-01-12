import React from "react"
import { View, StyleSheet, ViewStyle } from "react-native"
import { colors, borderRadius, spacing, shadows } from "../theme/colors"

interface GlassmorphicCardProps {
  children: React.ReactNode
  style?: ViewStyle
}

export const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    ...shadows.lg,
  },
})