import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextStyle,
  Dimensions,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MapPin } from "react-native-feather"
import { colors, spacing, typography, borderRadius, shadows } from "../../theme/colors"

const { width } = Dimensions.get("window")
const ITEM_WIDTH = (width - spacing.lg * 3) / 2

export default function SearchScreen({ navigation }: any) {
  const destinations = [
    {
      id: "1",
      name: "Paris",
      country: "France",
      image: "https://images.unsplash.com/photo-1499621574732-72324384dfbc?w=400",
    },
    {
      id: "2",
      name: "Tokyo",
      country: "Japan",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
    },
    {
      id: "3",
      name: "Barcelona",
      country: "Spain",
      image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400",
    },
    {
      id: "4",
      name: "Dubai",
      country: "UAE",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400",
    },
    {
      id: "5",
      name: "New York",
      country: "USA",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400",
    },
    {
      id: "6",
      name: "Bali",
      country: "Indonesia",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400",
    },
    {
      id: "7",
      name: "London",
      country: "UK",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400",
    },
    {
      id: "8",
      name: "Rome",
      country: "Italy",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400",
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Destinations ✈️</Text>
        <Text style={styles.subtitle}>Discover amazing places</Text>
      </View>

      <FlatList
        data={destinations}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("DestinationDetail", { destination: item })}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.overlay}>
              <View style={styles.locationBadge}>
                <MapPin width={12} height={12} color={colors.white} strokeWidth={2} />
                <Text style={styles.country}>{item.country}</Text>
              </View>
              <Text style={styles.name}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
      <View style={{ height: 100 }} />
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
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...(typography.body as TextStyle),
    color: "rgba(255, 255, 255, 0.9)",
  },
  grid: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.3,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.md,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    gap: spacing.xs,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    alignSelf: "flex-start",
  },
  country: {
    ...(typography.caption as TextStyle),
    color: colors.white,
    fontSize: 10,
    fontWeight: "600",
  },
  name: {
    ...(typography.h4 as TextStyle),
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
})