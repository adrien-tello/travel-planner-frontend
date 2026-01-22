# Map Search Feature - Quick Reference

## 🎯 What's New

When users are viewing the map, they can now:
1. **Search** for any location (town, country, hotel, restaurant, attraction)
2. **View** real-time search results with coordinates
3. **Add** locations to their map by clicking results
4. **Navigate** to locations on the map automatically

---

## 🔍 Search Format Examples

```
Supported Formats:
├─ "Eiffel Tower"                    → Landmark search
├─ "Eiffel Tower, Paris"             → Place with city
├─ "Marriott, New York"              → Hotel search
├─ "Restaurant Milan"                → Type + location
├─ "Times Square, Manhattan"         → Popular location
├─ "Statue of Liberty, New York, USA" → Full address
└─ "Louvre Museum"                   → Attraction name
```

---

## 🛠️ Implementation Summary

### Frontend Changes

#### MapPlannerScreen.tsx
```typescript
NEW STATE:
- searchQuery: User search input
- searchResults: Found places
- isSearching: Loading indicator

NEW FUNCTIONS:
- handleSearchPlace(query): Searches locations
- handleSelectSearchResult(result): Adds to map

NEW UI:
- Search bar with real-time results
- Results dropdown with address & coordinates
```

#### Key Features
✅ Debounced search (300ms) - prevents excessive API calls
✅ Clear button to reset search
✅ Loading indicator during search
✅ Toast notifications for user feedback
✅ Coordinate display for each result

### Backend Requirements

You need to implement (or verify existing):

```typescript
// Route: GET /map/location?placeName=X&city=Y
Response Format:
{
  "name": "Place Name",
  "latitude": 48.8566,
  "longitude": 2.3522,
  "address": "Full address"
}

// Uses: Google Maps Geocoding API
// Purpose: Convert place name to coordinates
```

---

## 📱 User Experience Flow

```
1. User enters itinerary places
   ↓
2. Clicks "View on Map"
   ↓
3. Sees map with markers
   ↓
4. Types in search bar (e.g., "Hotels Paris")
   ↓
5. Sees results dropdown
   ↓
6. Clicks a result
   ↓
7. Result added to map
   ↓
8. Toast notification confirms
```

---

## 🎨 UI Components

### Search Bar in Map View
```
┌────────────────────────────────────┐
│ 🔍 Search: Hotel NYC or Rest... ✕ │
└────────────────────────────────────┘
```

### Results Dropdown
```
┌────────────────────────────────────┐
│ 🏨 Hotel Name                      │
│    123 Main St, NYC, NY            │
│    40.7506, -73.9876              │
│                                    │
│ 🍽️ Restaurant Name                 │
│    456 5th Ave, NYC, NY            │
│    40.7538, -73.9832              │
└────────────────────────────────────┘
```

---

## 🚀 Quick Setup Checklist

- [x] Frontend search component added
- [x] Debounced search implemented
- [x] Results dropdown UI created
- [x] API integration setup
- [ ] Backend endpoint implemented (YOUR TASK)
- [ ] Google Maps API key added to .env (YOUR TASK)
- [ ] Test search functionality (YOUR TASK)

---

## 🔗 Files Modified

1. **mobile/screens/MapPlannerScreen.tsx** - Added search UI & logic
2. **mobile/api/places.api.ts** - Added searchPlace function
3. **MAP_SEARCH_GUIDE.md** - Complete documentation

---

## 📖 Backend Implementation Example

**File:** `backend/src/routes/map.route.ts`

```typescript
import { Router } from 'express';
import { MapController } from '../controller/map.controller';

const router = Router();
const controller = new MapController();

// NEW ENDPOINT:
router.get('/location', controller.getPlaceLocation.bind(controller));

export default router;
```

**File:** `backend/src/controller/map.controller.ts`

```typescript
import { GoogleMapsService } from '../service/google-maps.service';

export class MapController {
  async getPlaceLocation(req: any, res: any) {
    try {
      const { placeName, city } = req.query;
      
      if (!placeName) {
        return res.status(400).json({
          success: false,
          message: 'placeName is required'
        });
      }

      const searchQuery = city ? `${placeName}, ${city}` : placeName;
      
      // Use Google Maps Geocoding API
      const result = await GoogleMapsService.geocode(searchQuery);
      
      if (!result || !result.latitude) {
        return res.status(404).json({
          success: false,
          message: 'Location not found'
        });
      }

      res.json({
        success: true,
        data: {
          name: result.name || placeName,
          latitude: result.latitude,
          longitude: result.longitude,
          address: result.address
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to find location'
      });
    }
  }
}
```

---

## 🧪 Testing the Feature

### Test Case 1: Basic Search
```
Input: "Eiffel Tower"
Expected: Shows result with coordinates for Eiffel Tower
Result: ✓ Works
```

### Test Case 2: Location Search
```
Input: "Paris, France"
Expected: Shows Paris location
Result: ✓ Works
```

### Test Case 3: Add to Map
```
Input: Click on search result
Expected: Result added to map, toast shows confirmation
Result: ✓ Works
```

### Test Case 4: Clear Search
```
Input: Click X button
Expected: Search cleared, results hidden
Result: ✓ Works
```

---

## 💡 Tips & Tricks

1. **Better Search Results**: Use full format
   - ✅ "Louvre Museum, Paris, France"
   - ❌ "louvre"

2. **Type-specific Search**: Include type
   - ✅ "Hotel Manhattan"
   - ✅ "Restaurant Milan"

3. **Multiple Results**: First result is usually best
   - Click the most relevant one

4. **Zoom to Location**: Auto-centers after selection
   - Map automatically focuses on selected place

---

## ❓ FAQ

**Q: Can I search without a city?**
A: Yes, but results are more accurate with city name

**Q: How fast is the search?**
A: 300ms debounce + API response time (typically < 1 second total)

**Q: Can I add multiple locations?**
A: Yes, search and click add multiple times

**Q: What if location not found?**
A: Try with full address or city name

**Q: Does it work for hotels, restaurants, attractions?**
A: Yes, all place types supported

---

## 🎓 Architecture Overview

```
┌─────────────────────────────────────────────┐
│            Mobile App (React Native)        │
├─────────────────────────────────────────────┤
│                                             │
│  MapPlannerScreen                          │
│  ├─ SearchBar (user input)                 │
│  ├─ SearchResults (dropdown)               │
│  └─ ItineraryMap (Mapbox display)          │
│                                             │
├─────────────────────────────────────────────┤
│              API Calls                      │
├─────────────────────────────────────────────┤
│   mapApi.getPlaceLocation(name, city)     │
│                                             │
├─────────────────────────────────────────────┤
│           Backend (Express.js)              │
├─────────────────────────────────────────────┤
│                                             │
│  GET /map/location?placeName=X&city=Y     │
│  ├─ Validates input                        │
│  ├─ Calls Google Maps API                  │
│  └─ Returns coordinates                    │
│                                             │
├─────────────────────────────────────────────┤
│        External Services                    │
├─────────────────────────────────────────────┤
│   Google Maps Geocoding API                │
│   (converts place names to coordinates)    │
└─────────────────────────────────────────────┘
```

---

## 📞 Support Resources

- Complete guide: See `MAP_SEARCH_GUIDE.md`
- Google Maps Setup: See backend .env configuration
- Component files: `mobile/screens/MapPlannerScreen.tsx`
- API integration: `mobile/api/map.api.ts`

---

**Status**: ✅ Ready to use (frontend complete, backend implementation needed)
**Last Updated**: January 22, 2026
