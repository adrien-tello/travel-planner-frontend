import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Toast from "react-native-toast-message"
import { MapPin, Compass, User } from "react-native-feather"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { ThemeProvider, useTheme } from "./context/ThemeContext"
import { View, StyleSheet } from "react-native"
import "./services/mapbox.config" // Initialize Mapbox

// Screens
import LandingScreen from "./screens/auth/landing"
import LoginScreen from "./screens/auth/login"
import SignupScreen from "./screens/auth/signup"
import OnboardingScreen from "./screens/auth/onboarding"
import HomeScreen from "./screens/home/home"
import SearchScreen from "./screens/home/search"
import DestinationDetailScreen from "./screens/home/destinationDetail"
import CreateItineraryScreen from "./screens/itinerary/create"
import ItineraryDetailScreen from "./screens/itinerary/detail"
import TripPlanDetailScreen from "./screens/itinerary/tripPlanDetail"
import ProfileScreen from "./screens/profile/profile"
import AITripSuggestionsScreen from "./screens/ai/AITripSuggestionsScreen"
import TripDetailScreen from "./screens/ai/TripDetailScreen"
import DetailedItineraryScreen from "./screens/ai/DetailedItineraryScreen"
import MapPlannerScreen from "./screens/MapPlannerScreen"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function AuthStack() {
  return (
    <Stack.Navigator
      id="AuthStack"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  )
}

function OnboardingStack() {
  return (
    <Stack.Navigator
      id="OnboardingStack"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    </Stack.Navigator>
  )
}

function HomeStack() {
  return (
    <Stack.Navigator
      id="HomeStackNavigator"
      screenOptions={{
        headerShown: true,
        headerTitle: "Wanderlust",
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HomeTab" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AITripSuggestions" component={AITripSuggestionsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TripDetail" component={TripDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DetailedItinerary" component={DetailedItineraryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DestinationDetail" component={DestinationDetailScreen} options={{ title: "Destination" }} />
      <Stack.Screen name="CreateItinerary" component={CreateItineraryScreen} options={{ title: "Create Trip" }} />
      <Stack.Screen name="ItineraryDetail" component={ItineraryDetailScreen} options={{ title: "Trip Details" }} />
      <Stack.Screen name="TripPlanDetail" component={TripPlanDetailScreen} options={{ title: "Trip Plan" }} />
      <Stack.Screen name="MapPlanner" component={MapPlannerScreen} options={{ title: "Map Planner", headerShown: false }} />
    </Stack.Navigator>
  )
}

function SearchStack() {
  return (
    <Stack.Navigator
      id="SearchStackNavigator"
      screenOptions={{
        headerShown: true,
        headerTitle: "Explore Destinations",
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen name="SearchTab" component={SearchScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DestinationDetail" component={DestinationDetailScreen} options={{ title: "Destination" }} />
      <Stack.Screen name="CreateItinerary" component={CreateItineraryScreen} options={{ title: "Create Trip" }} />
    </Stack.Navigator>
  )
}

function MainTabs() {
  const insets = useSafeAreaInsets()
  const { colors } = useTheme()
  
  return (
    <View style={styles.tabContainer}>
      <Tab.Navigator
        id="MainTabs"
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textTertiary,
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 25,
            left: 20,
            right: 20,
            backgroundColor: colors.surface,
            borderRadius: 25,
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
            borderTopWidth: 0,
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="HomeStack"
          component={HomeStack}
          options={{
            title: "Trips",
            tabBarIcon: ({ color, size }) => <MapPin color={color} width={size} height={size} strokeWidth={2} />,
          }}
        />
        <Tab.Screen
          name="SearchStack"
          component={SearchStack}
          options={{
            title: "Explore",
            headerShown: false,
            tabBarIcon: ({ color, size }) => <Compass color={color} width={size} height={size} strokeWidth={2} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: "Profile",
            headerShown: true,
            headerTitle: "Profile",
            tabBarIcon: ({ color, size }) => <User color={color} width={size} height={size} strokeWidth={2} />,
          }}
        />
      </Tab.Navigator>
    </View>
  )
}

function RootNavigator() {
  const { isAuthenticated, isOnboarded } = useAuth()

  if (!isAuthenticated) {
    return <AuthStack />
  }

  if (!isOnboarded) {
    return <OnboardingStack />
  }

  return <MainTabs />
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
      <Toast />
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
  },
})