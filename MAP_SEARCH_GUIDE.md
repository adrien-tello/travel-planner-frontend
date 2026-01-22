# Map Search Feature - Implementation Guide

## Overview
This guide explains how the map search feature works and how to search for towns, countries, hotels, restaurants, and attractions on the map.

---

## ✨ Features Implemented

### 1. **Real-time Search on Map View**
- Search bar appears on the map screen
- Type location name, hotel, restaurant, or attraction name
- Results display instantly with coordinates
- Click result to add it to your map

### 2. **How It Works**

#### **Search Formats:**
```
Examples:
- "Eiffel Tower Paris"          → Finds attraction
- "Hotel NYC, New York"         → Finds hotel
- "Restaurant Milan"            → Finds restaurant
- "Times Square"                → Finds popular landmark
- "Central Park New York"       → Finds location
```

#### **Search Query Components:**
```
Format: [Place Name], [City/Country]

- Place Name: Hotel, Restaurant, Attraction name
- City/Country: Location context (optional)
```

---

## 🗺️ User Flow

### Step 1: Enter Itinerary Places
```
MapPlannerScreen → ItineraryPlacesForm
│
├─ Add place name (e.g., "Louvre Museum")
├─ Add city (e.g., "Paris")
├─ Select type (hotel, restaurant, attraction)
└─ Click "View on Map"
```

### Step 2: View Map
```
Map displays with:
├─ Colored markers for each place type
├─ Hotel markers → Blue
├─ Restaurant markers → Orange
├─ Attraction markers → Green
└─ Transport → Purple
```

### Step 3: Search for Additional Places
```
Search Bar:
│
├─ Type: "Eiffel Tower"
├─ See: Real-time search results
├─ Click: Result to add to map
└─ Result: Location zoomed on map
```

---

## 🔌 Backend API Endpoints

### 1. **Get Place Location** (Geocoding)
```bash
GET /map/location?placeName=Eiffel Tower&city=Paris

Response:
{
  "success": true,
  "data": {
    "name": "Eiffel Tower",
    "latitude": 48.858370,
    "longitude": 2.294481,
    "address": "5 Avenue Anatole France, 75007 Paris, France"
  }
}
```

**Implementation:**
- Backend uses Google Maps API
- Converts place names to coordinates (Geocoding)
- Returns latitude/longitude for map positioning

### 2. **Search Places** (Search)
```bash
GET /places/search?query=Louvre&type=attraction&location=Paris

Response:
{
  "success": true,
  "data": [
    {
      "id": "123",
      "name": "Louvre Museum",
      "latitude": 48.8606,
      "longitude": 2.3352,
      "address": "Rue de Rivoli, 75004 Paris",
      "rating": 4.8,
      "type": "attraction"
    }
  ]
}
```

---

## 📱 Frontend Components

### 1. **MapPlannerScreen** (`mobile/screens/MapPlannerScreen.tsx`)
- **Main map screen**
- Contains search functionality
- Handles place selection and map navigation

**Features:**
```typescript
- searchQuery: String input from user
- searchResults: Array of found places
- handleSearchPlace(): Debounced search (300ms)
- handleSelectSearchResult(): Add to map
```

### 2. **ItineraryMap** (`mobile/components/ItineraryMap.tsx`)
- **Displays map with markers**
- Shows all selected places
- Uses Mapbox for visualization

**Features:**
```typescript
- locations: Array of places to show
- markers: Color-coded by type
- camera: Auto-centers on locations
- bounds: Fits all markers in view
```

### 3. **TripMap** (`mobile/components/TripMap.tsx`)
- **Alternative map component**
- Used in trip details
- Shows attractions and route

---

## 🎯 How Search Works Step-by-Step

### 1. **User Types in Search Bar**
```typescript
onChangeText={(query) => handleSearchPlace(query)}
```

### 2. **Debounce Search (300ms delay)**
```typescript
// Prevents excessive API calls
searchTimeoutRef = setTimeout(() => {
  // API call happens here
}, 300)
```

### 3. **Geocoding API Call**
```typescript
const result = await mapApi.getPlaceLocation(placeName, city);
// Returns: { latitude, longitude, name, address }
```

### 4. **Display Results**
```typescript
// Show dropdown with found location
- Location name
- Address
- Coordinates
- Click to add to map
```

### 5. **Add to Map**
```typescript
const newPlace = {
  name: result.name,
  city: result.city,
  type: 'attraction'
};
setSelectedPlaces([...selectedPlaces, newPlace]);
```

---

## 🛠️ Configuration

### Backend Setup (Required)

**1. Set Google Maps API Key** (in `.env`):
```bash
GOOGLE_MAPS_API_KEY=your_api_key_here
```

**2. Create Backend Endpoint** (`backend/src/routes/map.route.ts`):
```typescript
router.get('/location', async (req, res) => {
  const { placeName, city } = req.query;
  const geocodeResult = await googleMapsClient.geocode({
    address: `${placeName}, ${city}`
  });
  
  res.json({
    success: true,
    data: {
      name: placeName,
      latitude: geocodeResult.results[0].geometry.location.lat,
      longitude: geocodeResult.results[0].geometry.location.lng,
      address: geocodeResult.results[0].formatted_address
    }
  });
});

router.get('/search', async (req, res) => {
  const { query, type, location } = req.query;
  // Search using Google Places API
  const result = await googlePlacesClient.textSearch({
    query: `${query} ${location}`,
    type: type // 'hotel', 'restaurant', 'tourist_attraction'
  });
  
  res.json({ success: true, data: result.results });
});
```

### Frontend Setup (Already Done ✅)

**1. Search Bar in Map View** ✅
- Located in `MapPlannerScreen`
- Real-time search with debouncing

**2. Search Results Display** ✅
- Dropdown showing location details
- Click to add to map

**3. Map Updates** ✅
- Uses `Mapbox` for visualization
- Auto-centers on selected places

---

## 📝 Search Examples

### Example 1: Find a Specific Hotel
```
User Input: "Marriott NYC"
Search Format: "Marriott, New York"

Backend Flow:
1. Geocode "Marriott, New York"
2. Get coordinates
3. Return location details

Result on Map:
- Marker placed at hotel location
- Added to itinerary
```

### Example 2: Find a Restaurant
```
User Input: "Pizza Restaurant Rome"
Search Format: "Pizza Restaurant, Rome"

Backend Flow:
1. Search for "Pizza Restaurant" in Rome
2. Get coordinates and details
3. Return top results

Result on Map:
- Shows restaurant marker
- Can add to itinerary
```

### Example 3: Find an Attraction
```
User Input: "Statue of Liberty"
Search Format: "Statue of Liberty, New York"

Backend Flow:
1. Geocode landmark
2. Get exact coordinates
3. Return attraction details

Result on Map:
- Marker at attraction
- Shows address and info
```

---

## 🐛 Troubleshooting

### Issue: Search returns no results
**Solution:**
- Use full location format: "Place Name, City, Country"
- Example: "Louvre, Paris, France"

### Issue: Map doesn't center on location
**Solution:**
- Check if coordinates are valid (lat: -90 to 90, lng: -180 to 180)
- Verify Google Maps API key in backend

### Issue: Search is too slow
**Solution:**
- Debounce delay is 300ms (already optimized)
- Check backend response time
- Increase API quota if needed

### Issue: Multiple results shown
**Solution:**
- Click the most relevant result
- Refine search with city/country name

---

## 🚀 Performance Optimization

### Frontend
```typescript
// Debounced search (prevents excessive calls)
searchTimeoutRef = setTimeout(() => {
  handleSearchPlace(query);
}, 300);

// Clear previous timeout on new input
if (searchTimeoutRef.current) {
  clearTimeout(searchTimeoutRef.current);
}
```

### Backend
```typescript
// Use connection pooling
// Cache frequent searches
// Implement rate limiting
```

---

## 📊 Data Flow Diagram

```
User Input
    ↓
MapPlannerScreen (searchQuery state)
    ↓
handleSearchPlace() (debounced)
    ↓
mapApi.getPlaceLocation()
    ↓
Backend: /map/location
    ↓
Google Maps API (Geocoding)
    ↓
Response: { latitude, longitude, name, address }
    ↓
Display in Dropdown (searchResults)
    ↓
User Clicks Result
    ↓
handleSelectSearchResult()
    ↓
Add to selectedPlaces
    ↓
ItineraryMap Component
    ↓
Mapbox Renders Location with Marker
```

---

## 🎨 UI Components

### Search Bar
```
┌─────────────────────────────────┐
│ 🔍 Search: Hotel NYC or Rest... │
│                              ✕  │
└─────────────────────────────────┘
```

### Search Results
```
┌────────────────────────────────────┐
│ 🏨 Marriott Marquis                │
│    1535 Broadway, New York, NY     │
│    40.7506, -73.9876              │
├────────────────────────────────────┤
│ 🍽️ Pizza Delivery                 │
│    456 5th Ave, New York, NY       │
│    40.7538, -73.9832              │
└────────────────────────────────────┘
```

### Map with Marker
```
           Map View
      ┌─────────────────┐
      │  🏨  🍽️   🎭    │
      │    📍           │
      │                 │
      │  (user location)│
      └─────────────────┘
      🏨 = Hotel
      🍽️ = Restaurant
      🎭 = Attraction
      📍 = Selected place
```

---

## 🔗 Related Files

- **Screen**: `mobile/screens/MapPlannerScreen.tsx`
- **Form**: `mobile/components/ItineraryPlacesForm.tsx`
- **Map**: `mobile/components/ItineraryMap.tsx`
- **API Client**: `mobile/api/map.api.ts`
- **Places API**: `mobile/api/places.api.ts`
- **Backend**: `backend/src/routes/map.route.ts`
- **Backend**: `backend/src/service/places.service.ts`

---

## 📚 Summary

✅ **Search Implemented** - Real-time location search
✅ **Map Integration** - Mapbox visualization
✅ **Geocoding** - Place name to coordinates conversion
✅ **Debouncing** - Optimized API calls
✅ **Type Support** - Hotels, restaurants, attractions, transport
✅ **User Feedback** - Toast notifications for actions

**Next Steps:**
1. Deploy backend endpoints
2. Add Google Maps API key to `.env`
3. Test search functionality
4. Optimize search results ranking
5. Add favorites/saved places feature
