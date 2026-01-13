# Wanderlust - AI-Powered Travel Planner

A comprehensive full-stack travel planning application with AI-powered itinerary generation, smart suggestions, and real-time collaboration features.

## Features

### Core Features
- **AI Itinerary Generation**: Generate complete multi-day itineraries based on destination, dates, budget, and preferences
- **Smart Suggestions**: Get budget-aware recommendations for hotels, restaurants, and activities when planning
- **Interactive Timeline**: Drag-and-drop event management with real-time map synchronization
- **Budget Tracking**: Monitor spending against budget with visual indicators
- **Travel Preferences**: Collect and store user preferences for personalized recommendations

### Authentication & Onboarding
- Email/password signup and login
- Password recovery flow
- 4-step preference onboarding (budget, pace, interests, dietary needs)

### Admin Panel
- Hotel listing management
- Reservation approval workflow
- Real-time availability tracking
- Budget-aware listing categorization

## Project Structure

```
wanderlust/
├── app/                              # Next.js app directory
│   ├── page.tsx                      # Landing page
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Design tokens & global styles
│   ├── auth/                         # Authentication routes
│   │   ├── signup/
│   │   ├── login/
│   │   └── forgot-password/
│   ├── onboarding/                   # Preference onboarding
│   ├── dashboard/                    # Main app dashboard
│   ├── my-trips/                     # Trip management
│   ├── create-itinerary/             # Trip creation wizard
│   ├── itinerary/[id]/               # Itinerary viewer & editor
│   ├── profile/                      # User profile & settings
│   └── admin/                        # Admin panel
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── suggestion-card.tsx           # Smart suggestion display
│   ├── timeline-event.tsx            # Event component
│   ├── destination-card.tsx          # Destination selector
│   ├── itinerary-summary.tsx         # Trip overview
│   ├── budget-indicator.tsx          # Budget badge
│   ├── bottom-sheet.tsx              # Mobile sheet component
│   └── auth-layout.tsx               # Auth page wrapper
├── store/
│   ├── user-store.ts                 # User state (Zustand)
│   ├── itinerary-store.ts            # Itinerary state (Zustand)
│   └── admin-store.ts                # Admin state (Zustand)
├── services/
│   └── mock-api.ts                   # Mock API layer
├── mobile/                           # React Native app
│   ├── app.tsx                       # Navigation setup
│   ├── screens/
│   │   ├── auth/                     # Auth screens
│   │   ├── home/                     # Home & search
│   │   ├── itinerary/                # Trip screens
│   │   └── profile/                  # Profile screen
│   ├── app.json                      # Expo config
│   └── package.json
├── public/                           # Static assets
│   └── *-cityscape.png              # Destination images
├── hooks/                            # Custom React hooks
├── lib/                              # Utility functions
├── package.json
├── tsconfig.json
└── next.config.mjs
```

## Tech Stack

### Web Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **State Management**: Zustand
- **Icons**: lucide-react

### Mobile Frontend
- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **State Management**: Zustand (shared with web)
- **Styling**: React Native StyleSheet
- **Icons**: react-native-feather

### Shared
- **Type Safety**: TypeScript
- **API Mocking**: Mock service layer in `services/mock-api.ts`

## Getting Started

### Web Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
open http://localhost:3000
```

### Mobile Development

```bash
# Install dependencies
cd mobile
npm install

# Run Expo dev server
npm start

# Run on iOS/Android
npm run ios
npm run android
```

## Design System

### Colors
- **Primary**: Blue (`#3b82f6`) - Main brand color
- **Accent**: Orange (`#f97316`) - Highlights & CTAs
- **Success**: Emerald - Budget-friendly indicators
- **Warning**: Yellow - Moderate pricing
- **Error**: Red - Premium/high-cost items
- **Neutrals**: Grays with light/dark mode support

### Typography
- **Heading Font**: Geist (sans-serif)
- **Body Font**: Geist (sans-serif)
- **Mono Font**: Geist Mono

### Components
- Reusable button, card, input, select components
- Budget indicators with color-coded pricing
- Timeline event components with drag support
- Smart suggestion cards with action buttons
- Bottom sheets for mobile-friendly interactions

## API Integration

Currently uses mock API with simulated delays:
- `searchDestinations()` - Find destinations
- `generateItinerary()` - AI itinerary generation
- `getHotelSuggestions()` - Hotel recommendations
- `getPOIDetails()` - Point of interest information
- `getAdminHotels()` - Admin hotel data
- `updateReservationStatus()` - Reservation management

### To Connect Real APIs

1. Update `services/mock-api.ts` with real API calls
2. Add environment variables for API keys
3. Implement error handling & loading states
4. Add API caching with React Query or SWR

## State Management

Using Zustand for global state:

```typescript
// User store
useUserStore() - Authentication & preferences

// Itinerary store
useItineraryStore() - Trip data & events

// Admin store
useAdminStore() - Hotel & reservation data
```

## Authentication Flow

1. User signs up → Email/password stored
2. Complete onboarding → Set preferences
3. Login with email/password
4. Access protected routes with auth check
5. Profile management & preference updates

## Smart Suggestions

When users click on timeline events or select "Suggest":
1. System retrieves budget-based recommendations
2. Filters by user preferences
3. Displays cards with budget indicators
4. Users can quick-add or customize

## Deployment

### Web (Vercel)
```bash
# Deploy to Vercel
vercel deploy
```

### Mobile (Expo)
```bash
# Build for iOS/Android
eas build --platform ios
eas build --platform android

# Submit to App Stores
eas submit --platform ios
eas submit --platform android
```

## Future Enhancements

- Real Google Maps integration with live markers
- Collaborative trip planning (share & edit)
- Push notifications for trip reminders
- Real backend database (Supabase/Firebase)
- Payment integration (Stripe)
- Social features (follow friends, share trips)
- ML-powered personalization
- Offline mode for itineraries
- Multi-language support
- Video tour guides & reviews

## Contributing

This is a demonstration project built with v0. For production use, integrate with real backend services and add proper error handling, authentication, and database persistence.

## License

MIT
