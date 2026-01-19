// Modern AI Travel Planner Theme
export const colors = {
  // Primary - AI Purple/Blue
  primary: "#6366f1", // Indigo
  primaryLight: "#818cf8",
  primaryDark: "#4f46e5",
  
  // Secondary - Teal (Travel/Exploration)
  secondary: "#14b8a6", // Teal
  secondaryLight: "#2dd4bf",
  secondaryDark: "#0d9488",
  
  // Accent Colors
  accent1: "#8b5cf6", // Purple (AI theme)
  accent2: "#ec4899", // Pink (Energy)
  accent3: "#f59e0b", // Amber (Warmth)
  accent4: "#10b981", // Emerald (Success)
  
  // Neutrals
  white: "#ffffff",
  black: "#0f172a",
  background: "#f8fafc",
  surface: "#ffffff",
  surfaceAlt: "#f1f5f9",
  
  // Text
  textPrimary: "#0f172a",
  textSecondary: "#64748b",
  textTertiary: "#94a3b8",
  
  // Borders & Dividers
  border: "#e2e8f0",
  borderLight: "#f1f5f9",
  divider: "#cbd5e1",
  
  // Status
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
  red: "#ef4444",
  
  // Form inputs
  inputBackground: "#f8fafc",
  text: "#0f172a",
  
  // Gradients - AI Themed
  gradientPurple: ["#8b5cf6", "#6366f1"] as const, // Purple to Indigo
  gradientTeal: ["#14b8a6", "#06b6d4"] as const, // Teal to Cyan
  gradientSunset: ["#f59e0b", "#ec4899"] as const, // Amber to Pink
  gradientOcean: ["#06b6d4", "#3b82f6"] as const, // Cyan to Blue
  gradientMagic: ["#a855f7", "#ec4899", "#f59e0b"] as const, // Purple-Pink-Amber
  gradientTravel: ["#6366f1", "#14b8a6"] as const, // Indigo to Teal
  gradientDark: ["#1e293b", "#0f172a"] as const, // Slate to Dark
}

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  colored: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  }),
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
}

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
}

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: "700" as const,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600" as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: "500" as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "500" as const,
    lineHeight: 16,
  },
  small: {
    fontSize: 12,
    fontWeight: "500" as const,
    lineHeight: 16,
  },
}