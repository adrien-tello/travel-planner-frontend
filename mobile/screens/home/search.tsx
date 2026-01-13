import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  TextStyle,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MapPin, ArrowRight } from "react-native-feather"
import { colors, spacing, typography, borderRadius, shadows } from "../../theme/colors"

export default function SearchScreen({ navigation }: any) {
  const destinations = [
    {
      id: "1",
      name: "Paris",
      country: "France",
      image: "https://images.unsplash.com/photo-1499621574732-72324384dfbc?w=400",
      description: "City of Light & Romance",
    },
    {
      id: "2",
      name: "Tokyo",
      country: "Japan",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
      description: "Modern Metropolis",
    },
    {
      id: "3",
      name: "Barcelona",
      country: "Spain",
      image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400",
      description: "Art & Architecture",
    },
    {
      id: "4",
      name: "Dubai",
      country: "UAE",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400",
      description: "Luxury & Innovation",
    },
    {
      id: "5",
      name: "New York",
      country: "USA",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400",
      description: "The Big Apple",
    },
    {
      id: "6",
      name: "Bali",
      country: "Indonesia",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400",
      description: "Tropical Paradise",
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore Destinations ✈️</Text>
        <Text style={styles.subtitle}>Discover amazing places around the world</Text>
      </View>

      <FlatList
        data={destinations}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("DestinationDetail", { destination: item })}
            activeOpacity={0.9}
          >
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.cardImage}
              imageStyle={styles.cardImageStyle}
            >
              <View style={styles.cardOverlay}>
                <View style={styles.cardContent}>
                  <View style={styles.locationContainer}>
                    <MapPin width={16} height={16} color={colors.white} strokeWidth={2} />
                    <Text style={styles.cardCountry}>{item.country}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                </View>
                <View style={styles.cardButton}>
                  <ArrowRight width={20} height={20} color={colors.white} strokeWidth={2} />
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    ...shadows.lg,
  },
  title: {
    ...(typography.h2 as TextStyle),
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...(typography.body as TextStyle),
    color: "rgba(255, 255, 255, 0.9)",
  },
  list: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    height: 240,
    ...shadows.xl,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardImageStyle: {
    borderRadius: borderRadius.xl,
  },
  cardOverlay: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  cardContent: {
    gap: spacing.xs,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: "flex-start",
  },
  cardCountry: {
    ...(typography.caption as TextStyle),
    color: colors.white,
    fontWeight: "600",
  },
  cardTitle: {
    ...(typography.h2 as TextStyle),
    color: colors.white,
    marginTop: spacing.sm,
  },
  cardDescription: {
    ...(typography.body as TextStyle),
    color: "rgba(255, 255, 255, 0.9)",
  },
  cardButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    ...shadows.md,
  },
})