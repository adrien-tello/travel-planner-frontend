import { useEffect, useState } from "react"
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated"
import { Zap, Plane, BrainCircuit, MapPin } from "lucide-react-native"
import { colors, spacing, typography, borderRadius, shadows } from "../../theme/colors"
import { GradientButton } from "../../components/GradientButton"

const { width, height } = Dimensions.get("window")

interface LandingScreenProps {
  navigation: any
}

export default function LandingScreen({ navigation }: LandingScreenProps) {
  const [phase, setPhase] = useState(1)

  // Phase 1 animations
  const logoScale = useSharedValue(0)
  const logoOpacity = useSharedValue(0)
  const titleOpacity = useSharedValue(0)
  const taglineOpacity = useSharedValue(0)

  // Phase 2 animations
  const feature1Opacity = useSharedValue(0)
  const feature1TranslateY = useSharedValue(30)
  const feature2Opacity = useSharedValue(0)
  const feature2TranslateY = useSharedValue(30)
  const feature3Opacity = useSharedValue(0)
  const feature3TranslateY = useSharedValue(30)

  // Phase 3 animations
  const ctaOpacity = useSharedValue(0)
  const ctaTranslateY = useSharedValue(20)

  useEffect(() => {
    // Phase 1: Logo reveal
    logoScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.back(1.5)) })
    logoOpacity.value = withTiming(1, { duration: 600 })
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 600 }))
    taglineOpacity.value = withDelay(800, withTiming(1, { duration: 600 }))

    // Transition to Phase 2
    const phase2Timer = setTimeout(() => {
      setPhase(2)
    }, 2500)

    return () => clearTimeout(phase2Timer)
  }, [])

  useEffect(() => {
    if (phase === 2) {
      // Phase 2: Feature highlights
      feature1Opacity.value = withTiming(1, { duration: 500 })
      feature1TranslateY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })

      feature2Opacity.value = withDelay(300, withTiming(1, { duration: 500 }))
      feature2TranslateY.value = withDelay(300, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }))

      feature3Opacity.value = withDelay(600, withTiming(1, { duration: 500 }))
      feature3TranslateY.value = withDelay(600, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }))

      // Transition to Phase 3
      const phase3Timer = setTimeout(() => {
        setPhase(3)
      }, 2500)

      return () => clearTimeout(phase3Timer)
    }
  }, [phase])

  useEffect(() => {
    if (phase === 3) {
      // Phase 3: CTA buttons
      ctaOpacity.value = withTiming(1, { duration: 600 })
      ctaTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) })
    }
  }, [phase])

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }))

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }))

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }))

  const feature1AnimatedStyle = useAnimatedStyle(() => ({
    opacity: feature1Opacity.value,
    transform: [{ translateY: feature1TranslateY.value }],
  }))

  const feature2AnimatedStyle = useAnimatedStyle(() => ({
    opacity: feature2Opacity.value,
    transform: [{ translateY: feature2TranslateY.value }],
  }))

  const feature3AnimatedStyle = useAnimatedStyle(() => ({
    opacity: feature3Opacity.value,
    transform: [{ translateY: feature3TranslateY.value }],
  }))

  const ctaAnimatedStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaTranslateY.value }],
  }))

  return (
    <LinearGradient
      colors={[...colors.gradientMagic, "#1e1b4b"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Phase 1: Logo and Branding */}
        <View style={styles.phase1Container}>
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <LinearGradient
              colors={["rgba(255, 255, 255, 0.2)", "rgba(255, 255, 255, 0.05)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoBackground}
            >
              <Zap color={colors.white} size={64} strokeWidth={2} />
            </LinearGradient>
          </Animated.View>

          <Animated.Text style={[styles.title, titleAnimatedStyle]}>
            Wanderlust AI
          </Animated.Text>

          <Animated.Text style={[styles.tagline, taglineAnimatedStyle]}>
            Your AI-Powered Travel Companion
          </Animated.Text>
        </View>

        {/* Phase 2: Features */}
        {phase >= 2 && (
          <View style={styles.featuresContainer}>
            <Animated.View style={[styles.featureCard, feature1AnimatedStyle]}>
              <View style={styles.featureIconContainer}>
                <Plane color={colors.accent2} size={28} strokeWidth={2} />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Smart Planning</Text>
                <Text style={styles.featureDescription}>
                  AI-powered itineraries tailored to you
                </Text>
              </View>
            </Animated.View>

            <Animated.View style={[styles.featureCard, feature2AnimatedStyle]}>
              <View style={styles.featureIconContainer}>
                <BrainCircuit color={colors.accent1} size={28} strokeWidth={2} />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Personalized</Text>
                <Text style={styles.featureDescription}>
                  Recommendations based on your preferences
                </Text>
              </View>
            </Animated.View>

            <Animated.View style={[styles.featureCard, feature3AnimatedStyle]}>
              <View style={styles.featureIconContainer}>
                <MapPin color={colors.secondary} size={28} strokeWidth={2} />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Discover More</Text>
                <Text style={styles.featureDescription}>
                  Explore hidden gems and local favorites
                </Text>
              </View>
            </Animated.View>
          </View>
        )}

        {/* Phase 3: CTA Buttons */}
        {phase === 3 && (
          <Animated.View style={[styles.ctaContainer, ctaAnimatedStyle]}>
            <Text style={styles.ctaTitle}>Ready to Start Your Journey?</Text>

            <GradientButton
              title="Create Account"
              onPress={() => navigation.navigate("Signup")}
              gradient={colors.gradientPurple}
              style={styles.signupButton}
            />

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.7}
            >
              <Text style={styles.loginButtonText}>Already have an account? Sign In</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Loading Indicator for Phases 1 & 2 */}
        {phase < 3 && (
          <View style={styles.loadingContainer}>
            <View style={styles.progressContainer}>
              <View style={[styles.progressDot, phase >= 1 && styles.progressDotActive]} />
              <View style={[styles.progressDot, phase >= 2 && styles.progressDotActive]} />
              <View style={[styles.progressDot, phase >= 3 && styles.progressDotActive]} />
            </View>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  phase1Container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -80,
  },
  logoContainer: {
    marginBottom: spacing.xxxl,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.xl,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  title: {
    ...typography.h1,
    fontSize: 40,
    color: colors.white,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: spacing.md,
    letterSpacing: -1,
  },
  tagline: {
    ...typography.body,
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontWeight: "500",
  },
  featuresContainer: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.lg,
    marginTop: -100,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    ...shadows.md,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.lg,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    ...typography.h4,
    fontSize: 18,
    color: colors.white,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  featureDescription: {
    ...typography.bodySmall,
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 20,
  },
  ctaContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: spacing.xxxl,
  },
  ctaTitle: {
    ...typography.h3,
    fontSize: 24,
    color: colors.white,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: spacing.xxxl,
    letterSpacing: -0.5,
  },
  signupButton: {
    marginBottom: spacing.lg,
  },
  loginButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
  },
  loginButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: "600",
    fontSize: 15,
  },
  loadingContainer: {
    position: "absolute",
    bottom: spacing.xxxl + 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  progressContainer: {
    flexDirection: "row",
    gap: spacing.md,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  progressDotActive: {
    backgroundColor: colors.white,
    width: 24,
  },
})