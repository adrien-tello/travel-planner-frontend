import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, TextStyle } from "react-native"
import { Zap } from "react-native-feather"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { useAuth } from "../../context/AuthContext"
import { colors, spacing, typography, borderRadius, shadows } from "../../theme/colors"
import { GradientButton } from "../../components/GradientButton"
import { showToast } from "../../utils/toast"

export default function SignupScreen({ navigation }: any) {
  const { signUp } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async () => {
    // Validation
    if (!name.trim()) {
      showToast({ type: "error", text1: "Name Required", text2: "Please enter your full name" })
      return
    }
    if (!email.trim()) {
      showToast({ type: "error", text1: "Email Required", text2: "Please enter your email address" })
      return
    }
    if (!password) {
      showToast({ type: "error", text1: "Password Required", text2: "Please create a password" })
      return
    }
    if (password !== confirmPassword) {
      showToast({ type: "error", text1: "Passwords Don't Match", text2: "Please make sure passwords match" })
      return
    }
    if (password.length < 6) {
      showToast({ type: "error", text1: "Password Too Short", text2: "Password must be at least 6 characters" })
      return
    }

    setIsLoading(true)
    try {
      await signUp({ name: name.trim(), email: email.trim(), password })
      showToast({ type: "success", text1: "Account Created!", text2: "Welcome to Wanderlust AI" })
    } catch (error: any) {
      showToast({ 
        type: "error", 
        text1: "Signup Failed", 
        text2: error.response?.data?.message || "Failed to create account" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={colors.gradientTeal}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.iconContainer}>
            <Zap width={32} height={32} color={colors.white} strokeWidth={2.5} />
          </View>
          <Text style={styles.title}>Join Wanderlust AI</Text>
          <Text style={styles.tagline}>Start Your AI-Powered Journey</Text>
        </LinearGradient>

        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Create Account 🌍</Text>
          <Text style={styles.welcomeSubtitle}>Let AI plan your perfect adventure</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Traveler"
              placeholderTextColor={colors.textTertiary}
              value={name}
              onChangeText={setName}
              editable={!isLoading}
            />
          </View>

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
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a strong password"
              placeholderTextColor={colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter your password"
              placeholderTextColor={colors.textTertiary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <GradientButton
            title="Create Account"
            onPress={handleSignup}
            loading={isLoading}
            gradient={colors.gradientTeal}
            style={styles.button}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")} activeOpacity={0.7}>
            <Text style={styles.link}>Sign In</Text>
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