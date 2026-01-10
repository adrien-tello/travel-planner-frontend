import React from "react"
import { View, StyleSheet, ViewStyle } from "react-native"
import { colors, borderRadius, spacing } from "../theme/colors"

interface GlassmorphicCardProps {
  children: React.ReactNode
  style?: ViewStyle
}

export const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
})