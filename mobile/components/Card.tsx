import React from "react"
import { View, StyleSheet, ViewStyle } from "react-native"
import { colors, borderRadius, spacing, shadows } from "../theme/colors"

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  elevated?: boolean
}

export const Card: React.FC<CardProps> = ({ children, style, elevated = true }) => {
  return <View style={[styles.card, elevated && shadows.lg, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
})