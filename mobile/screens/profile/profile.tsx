import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextStyle,
  Image,
  Modal,
  TextInput,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LogOut, MapPin, Award, TrendingUp, User as UserIcon, Edit3, X } from "react-native-feather"
import { useAuth } from "../../context/AuthContext"
import { useTripStore } from "../../store/tripStore"
import { colors, spacing, typography, borderRadius, shadows } from "../../theme/colors"
import { useTheme } from "../../context/ThemeContext"
import { ThemeToggle } from "../../components/ThemeToggle"
import React, { useState, useEffect } from "react"
import { getUserData, getUserPreferences } from "../../utils/storage"
import { preferencesApi } from "../../api/preferences.api"

export default function ProfileScreen() {
  const { signOut } = useAuth()
  const trips = useTripStore((state) => state.trips)
  const { colors } = useTheme()
  const [userData, setUserData] = useState<any>(null)
  const [userPreferences, setUserPreferences] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editedPreferences, setEditedPreferences] = useState<any>(null)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const [storedUserData, storedPreferences] = await Promise.all([
        getUserData(),
        preferencesApi.getPreferences()
      ])
      
      setUserData(storedUserData)
      setUserPreferences(storedPreferences)
      setEditedPreferences(storedPreferences)
    } catch (error) {
      console.log('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePreferences = async () => {
    try {
      await preferencesApi.updatePreferences(editedPreferences)
      setUserPreferences(editedPreferences)
      setShowEditModal(false)
    } catch (error) {
      console.log('Error updating preferences:', error)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.avatarContainer}>
          {userData?.profilePicture ? (
            <Image source={{ uri: userData.profilePicture }} style={styles.avatarImage} />
          ) : (
            <Text style={[styles.avatarText, { color: colors.white }]}>
              {getInitials(userData?.name || userData?.fullName || 'User')}
            </Text>
          )}
        </View>
        <Text style={[styles.userName, { color: colors.white }]}>
          {userData?.name || userData?.fullName || 'Travel Enthusiast'}
        </Text>
        <Text style={[styles.userEmail, { color: 'rgba(255, 255, 255, 0.9)' }]}>
          {userData?.email || 'user@example.com'}
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MapPin width={24} height={24} color={colors.primary} strokeWidth={2} />
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>{trips.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Trips</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TrendingUp width={24} height={24} color={colors.secondary} strokeWidth={2} />
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>12</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Countries</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Award width={24} height={24} color={colors.accent1} strokeWidth={2} />
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>5</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Badges</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Account Information</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Full Name</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {userData?.name || userData?.fullName || 'Not provided'}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {userData?.email || 'Not provided'}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Member Since</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {formatDate(userData?.createdAt || userData?.joinDate)}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Plan</Text>
              <Text style={[styles.infoValue, styles.planBadge, { color: colors.primary }]}>Premium ✨</Text>
            </View>
          </View>
        </View>

        {/* Theme Toggle */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Appearance</Text>
          <ThemeToggle />
        </View>

        {/* Travel Preferences */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Travel Preferences</Text>
            {userPreferences && (
              <TouchableOpacity 
                style={[styles.editButton, { backgroundColor: colors.primary }]}
                onPress={() => setShowEditModal(true)}
              >
                <Edit3 width={16} height={16} color={colors.white} />
                <Text style={[styles.editButtonText, { color: colors.white }]}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
          {userPreferences ? (
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Travel Style</Text>
                <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                  {userPreferences.travelStyle || 'Not set'}
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Budget Range</Text>
                <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                  {userPreferences.budgetRange || 'Not set'}
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Interests</Text>
                <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                  {userPreferences.interests?.join(', ') || 'Not set'}
                </Text>
              </View>
              {userPreferences.planning && (
                <>
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Group Size</Text>
                    <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                      {userPreferences.planning.groupSize || 'Not set'}
                    </Text>
                  </View>
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Travel with Kids</Text>
                    <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                      {userPreferences.planning.travelWithKids ? 'Yes' : 'No'}
                    </Text>
                  </View>
                </>
              )}
            </View>
          ) : (
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.emptyPreferences}>
                <UserIcon width={48} height={48} color={colors.textTertiary} />
                <Text style={[styles.emptyPreferencesText, { color: colors.textSecondary }]}>
                  No travel preferences set yet
                </Text>
                <Text style={[styles.emptyPreferencesSubtext, { color: colors.textTertiary }]}>
                  Complete your onboarding to set your travel preferences
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.error, ...shadows.colored(colors.error) }]}
          activeOpacity={0.8} 
          onPress={signOut}
        >
          <LogOut width={20} height={20} color={colors.white} strokeWidth={2} />
          <Text style={[styles.logoutText, { color: colors.white }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={{ height: 100 }} />

      {/* Edit Preferences Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Edit Preferences</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <X width={24} height={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Travel Style</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border }]}
                value={editedPreferences?.travelStyle || ''}
                onChangeText={(text) => setEditedPreferences({...editedPreferences, travelStyle: text})}
                placeholder="e.g., Adventure, Relaxation, Cultural"
                placeholderTextColor={colors.textTertiary}
              />

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Budget Range</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border }]}
                value={editedPreferences?.budgetRange || ''}
                onChangeText={(text) => setEditedPreferences({...editedPreferences, budgetRange: text})}
                placeholder="e.g., low, mid, high"
                placeholderTextColor={colors.textTertiary}
              />

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Interests (comma separated)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border }]}
                value={editedPreferences?.interests?.join(', ') || ''}
                onChangeText={(text) => setEditedPreferences({...editedPreferences, interests: text.split(',').map(i => i.trim())})}
                placeholder="e.g., food, culture, adventure"
                placeholderTextColor={colors.textTertiary}
                multiline
              />

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSavePreferences}
              >
                <Text style={[styles.saveButtonText, { color: colors.white }]}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    ...shadows.lg,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  avatarText: {
    ...(typography.h1 as TextStyle),
    fontWeight: "700",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
  },
  userName: {
    ...(typography.h3 as TextStyle),
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...(typography.body as TextStyle),
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginTop: -spacing.xl,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    ...shadows.md,
  },
  statValue: {
    ...(typography.h2 as TextStyle),
    fontWeight: "700",
  },
  statLabel: {
    ...(typography.caption as TextStyle),
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    ...shadows.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...(typography.h4 as TextStyle),
    marginBottom: spacing.md,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    ...(typography.body as TextStyle),
    fontWeight: "500",
  },
  infoValue: {
    ...(typography.body as TextStyle),
    fontWeight: "600",
  },
  planBadge: {
    // Dynamic color will be applied inline
  },
  divider: {
    height: 1,
    marginVertical: spacing.xs,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  settingText: {
    ...(typography.body as TextStyle),
  },
  settingValue: {
    ...(typography.bodySmall as TextStyle),
    fontWeight: "600",
  },
  logoutButton: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  logoutText: {
    ...(typography.h4 as TextStyle),
    fontWeight: "700",
  },
  emptyPreferences: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  emptyPreferencesText: {
    ...(typography.body as TextStyle),
    fontWeight: "600",
    textAlign: "center",
  },
  emptyPreferencesSubtext: {
    ...(typography.bodySmall as TextStyle),
    textAlign: "center",
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  editButtonText: {
    ...(typography.bodySmall as TextStyle),
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...(typography.h3 as TextStyle),
    fontWeight: "700",
  },
  modalBody: {
    padding: spacing.lg,
  },
  inputLabel: {
    ...(typography.bodySmall as TextStyle),
    fontWeight: "600",
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...(typography.body as TextStyle),
  },
  saveButton: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  saveButtonText: {
    ...(typography.h4 as TextStyle),
    fontWeight: "700",
  },
})