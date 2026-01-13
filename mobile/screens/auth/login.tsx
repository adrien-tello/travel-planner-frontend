import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, TextStyle } from "react-native"
import { Zap } from "react-native-feather"
import { LinearGradient } from "expo-linear-gradient"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAuth } from "../../context/AuthContext"
import { colors, spacing, typography, borderRadius, shadows } from "../../theme/colors"
import { GradientButton } from "../../components/GradientButton"
import { showToast } from "../../utils/toast"

export default function LoginScreen({ navigation }: any) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      showToast({
        type: "error",
        text1: "Missing Information",
        text2: "Please enter both email and password"
      })
      return
    }

    setLoading(true)
    try {
      await signIn({ email, password })
      showToast({
        type: "success",
        text1: "Welcome back! 🎉",
        text2: "Login successful"
      })
      navigation.navigate("Onboarding")
    } catch (error: any) {
      showToast({
        type: "error",
        text1: "Login Failed",
        text2: error.response?.data?.message || "Invalid credentials"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={colors.gradientMagic}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.iconContainer}>
            <Zap width={32} height={32} color={colors.white} strokeWidth={2.5} />
          </View>
          <Text style={styles.title}>Wanderlust AI</Text>
          <Text style={styles.tagline}>Your AI-Powered Travel Companion</Text>
        </LinearGradient>

        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome Back! ✈️</Text>
          <Text style={styles.welcomeSubtitle}>Sign in to continue your adventure</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor={colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <GradientButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            gradient={colors.gradientPurple}
            style={styles.button}
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")} activeOpacity={0.7}>
            <Text style={styles.link}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Back to Landing */}
        <TouchableOpacity 
          style={styles.backToLanding} 
          onPress={() => navigation.navigate("Landing")}
          activeOpacity={0.7}
        >
          <Text style={styles.backToLandingText}>← Back to Home</Text>
        </TouchableOpacity>
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
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
    ...shadows.xl,
  },
  title: {
    ...(typography.h1 as TextStyle),
    color: colors.white,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  tagline: {
    ...(typography.bodySmall as TextStyle),
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  welcomeContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.lg,
  },
  welcomeTitle: {
    ...(typography.h2 as TextStyle),
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  welcomeSubtitle: {
    ...(typography.body as TextStyle),
    color: colors.textSecondary,
  },
  form: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  label: {
    ...(typography.caption as TextStyle),
    color: colors.textPrimary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  button: {
    marginTop: spacing.md,
  },
  forgotPassword: {
    alignSelf: "center",
    paddingVertical: spacing.sm,
  },
  forgotPasswordText: {
    ...(typography.bodySmall as TextStyle),
    color: colors.primary,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxxl,
  },
  footerText: {
    ...(typography.body as TextStyle),
    color: colors.textSecondary,
  },
  link: {
    ...(typography.body as TextStyle),
    color: colors.primary,
    fontWeight: "700",
  },
  backToLanding: {
    alignSelf: "center",
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
  },
  backToLandingText: {
    ...(typography.bodySmall as TextStyle),
    color: colors.textTertiary,
    fontWeight: "600",
  },
})