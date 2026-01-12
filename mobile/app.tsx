import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Toast from "react-native-toast-message"
import { MapPin, Compass, User } from "react-native-feather"
import { AuthProvider, useAuth } from "./context/AuthContext"

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
      <Stack.Screen name="HomeTab" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DestinationDetail" component={DestinationDetailScreen} options={{ title: "Destination" }} />
      <Stack.Screen name="CreateItinerary" component={CreateItineraryScreen} options={{ title: "Create Trip" }} />
      <Stack.Screen name="ItineraryDetail" component={ItineraryDetailScreen} options={{ title: "Trip Details" }} />
      <Stack.Screen name="TripPlanDetail" component={TripPlanDetailScreen} options={{ title: "Trip Plan" }} />
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
  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={{
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#9ca3af",
        headerShown: false,
        // tabBarStyle: {
        //   paddingBottom: insets.bottom, 
        //   height: 60 + insets.bottom,
        // },
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
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </QueryClientProvider>
      <Toast />
    </SafeAreaProvider>
  )
}