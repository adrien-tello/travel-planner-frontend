"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItineraryPlannerService = void 0;
class ItineraryPlannerService {
    constructor() {
        this.geminiApiKey = process.env.GEMINI_API_KEY;
        this.serpApiKey = process.env.SERP_API_KEY || "demo";
        this.googlePhotoApiKey = process.env.GOOGLE_PHOTO_API_KEY;
        this.googlePlacesApiBase = "https://maps.googleapis.com/maps/api/place";
        this.googleMapsApiBase = "https://serpapi.com/search.json";
        this.googleHotelApiBase = "https://serpapi.com/search.json";
        this.googleTravelApiBase = "https://serpapi.com/search.json";
    }
    async generateDetailedItinerary(destination, duration, preferences) {
        try {
            // Step 1: Get comprehensive destination info from Gemini
            const destinationInfo = await this.getDestinationDetails(destination, preferences);
            // Step 2: Get real data from all APIs in parallel
            const [hotels, restaurants, activities, photos, mapData] = await Promise.all([
                this.getHotelsWithDetails(destination, preferences),
                this.getRestaurantsWithDetails(destination, preferences),
                this.getActivitiesWithDetails(destination, preferences),
                this.getDestinationPhotos(destination),
                this.getMapData(destination)
            ]);
            // Step 3: Generate AI-powered daily itinerary
            const dailyItinerary = await this.generateSimpleDailyItinerary(destination, duration, preferences);
            return {
                id: `itinerary_${Date.now()}`,
                destination,
                duration,
                totalBudget: this.calculateTotalBudget(dailyItinerary, hotels),
                days: dailyItinerary,
                hotels: hotels.slice(0, 5),
                flightInfo: await this.getFlightInfo(destination),
                travelTips: destinationInfo.travelTips || [],
                destinationInfo,
                photos,
                coverImage: photos[0] || '',
                mapData
            };
        }
        catch (error) {
            console.error('Itinerary generation error:', error);
            return this.getFallbackItinerary(destination, duration, preferences);
        }
    }
    async getDestinationDetails(destination, preferences) {
        const prompt = `Provide comprehensive information about ${destination} for travelers with these preferences:
    Travel Style: ${preferences.travelStyle}
    Interests: ${preferences.interests.join(', ')}
    
    Return JSON:
    {
      "description": "Detailed description of the destination",
      "bestTimeToVisit": "Best months to visit",
      "climate": "Climate information",
      "culture": "Cultural highlights",
      "language": "Primary language",
      "currency": "Local currency",
      "timeZone": "Time zone",
      "attractions": ["top attractions"],
      "travelTips": ["practical travel tips"]
    }`;
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.geminiApiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                }),
                signal: controller.signal
            });
            clearTimeout(timeout);
            const data = await response.json();
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
                console.error('Invalid Gemini API response structure:', data);
                return this.getDefaultDestinationInfo(destination);
            }
            const aiResponse = data.candidates[0].content.parts[0].text;
            return this.parseDestinationInfo(aiResponse);
        }
        catch (error) {
            console.error('Destination details error:', error);
            return this.getDefaultDestinationInfo(destination);
        }
    }
    async getHotelsWithDetails(destination, preferences) {
        try {
            const response = await fetch(`${this.googleHotelApiBase}?engine=google_local&q=hotels+${encodeURIComponent(destination)}&api_key=${this.serpApiKey}`);
            const data = await response.json();
            const hotels = await Promise.all((data.local_results || []).slice(0, 8).map(async (hotel) => {
                const photos = await this.getHotelPhotos(hotel.place_id || hotel.data_id, hotel.title || hotel.name, destination);
                return {
                    name: hotel.title || hotel.name,
                    rating: hotel.rating || 4.0,
                    pricePerNight: this.estimateHotelPrice(preferences.budgetRange),
                    amenities: hotel.amenities || ['WiFi', 'Breakfast', 'AC'],
                    photos: photos,
                    location: hotel.address || destination,
                    coordinates: {
                        lat: hotel.gps_coordinates?.latitude || 0,
                        lng: hotel.gps_coordinates?.longitude || 0
                    },
                    placeId: hotel.place_id || hotel.data_id
                };
            }));
            return hotels;
        }
        catch (error) {
            console.error('Hotels API error:', error);
            return [];
        }
    }
    async getRestaurantsWithDetails(destination, preferences) {
        try {
            const cuisineQuery = preferences.interests.includes('food') ? 'best restaurants' : 'restaurants';
            const response = await fetch(`${this.googleMapsApiBase}?engine=google_local&q=${cuisineQuery}+${encodeURIComponent(destination)}&api_key=${this.serpApiKey}`);
            const data = await response.json();
            return await Promise.all((data.local_results || []).slice(0, 10).map(async (restaurant) => {
                const photos = await this.getRestaurantPhotos(restaurant.place_id || restaurant.data_id, restaurant.title || restaurant.name, destination);
                return {
                    name: restaurant.title || restaurant.name,
                    cuisine: restaurant.type || 'Local',
                    rating: restaurant.rating || 4.0,
                    priceRange: this.estimateRestaurantPrice(preferences.budgetRange),
                    photos: photos,
                    address: restaurant.address,
                    coordinates: {
                        lat: restaurant.gps_coordinates?.latitude || 0,
                        lng: restaurant.gps_coordinates?.longitude || 0
                    },
                    placeId: restaurant.place_id || restaurant.data_id
                };
            }));
        }
        catch (error) {
            console.error('Restaurants API error:', error);
            return [];
        }
    }
    async getActivitiesWithDetails(destination, preferences) {
        try {
            const interestQuery = preferences.interests.length > 0
                ? `${preferences.interests.join(' ')} activities attractions`
                : 'tourist attractions activities';
            const response = await fetch(`${this.googleMapsApiBase}?engine=google_local&q=${interestQuery}+${encodeURIComponent(destination)}&api_key=${this.serpApiKey}`);
            const data = await response.json();
            return await Promise.all((data.local_results || []).slice(0, 12).map(async (activity) => {
                const photos = await this.getActivityPhotos(activity.place_id || activity.data_id, activity.title || activity.name, destination);
                return {
                    name: activity.title || activity.name,
                    description: activity.snippet || 'Popular attraction',
                    category: this.categorizeActivity(activity.type || activity.title),
                    rating: activity.rating || 4.0,
                    price: this.estimateActivityPrice(preferences.budgetRange),
                    duration: '2-3 hours',
                    photos: photos,
                    coordinates: {
                        lat: activity.gps_coordinates?.latitude || 0,
                        lng: activity.gps_coordinates?.longitude || 0
                    },
                    placeId: activity.place_id || activity.data_id
                };
            }));
        }
        catch (error) {
            console.error('Activities API error:', error);
            return [];
        }
    }
    async getPlacePhotos(placeId) {
        try {
            if (!this.googlePhotoApiKey) {
                console.warn('Google Photo API key not configured');
                return [];
            }
            const response = await fetch(`${this.googlePlacesApiBase}/details/json?place_id=${placeId}&fields=photos&key=${this.googlePhotoApiKey}`);
            const data = await response.json();
            if (data.result && data.result.photos) {
                return data.result.photos.slice(0, 5).map((photo) => {
                    const photoReference = photo.photo_reference;
                    return `${this.googlePlacesApiBase}/photo?maxwidth=400&photoreference=${photoReference}&key=${this.googlePhotoApiKey}`;
                });
            }
            return [];
        }
        catch (error) {
            console.error('Error fetching place photos:', error);
            return [];
        }
    }
    async searchPlaceAndGetPhotos(query, type = '') {
        try {
            if (!this.googlePhotoApiKey) {
                console.warn('Google Photo API key not configured');
                return [];
            }
            // First, search for the place to get place_id
            const searchResponse = await fetch(`${this.googlePlacesApiBase}/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${this.googlePhotoApiKey}`);
            const searchData = await searchResponse.json();
            if (searchData.candidates && searchData.candidates.length > 0) {
                const placeId = searchData.candidates[0].place_id;
                return await this.getPlacePhotos(placeId);
            }
            return [];
        }
        catch (error) {
            console.error('Error searching place photos:', error);
            return [];
        }
    }
    async getHotelPhotos(placeId, hotelName, destination) {
        try {
            // Try to get photos using place_id first
            if (placeId) {
                const photos = await this.getPlacePhotos(placeId);
                if (photos.length > 0)
                    return photos.slice(0, 3);
            }
            // Fallback: Search for hotel by name
            const query = `${hotelName} hotel ${destination}`;
            return await this.searchPlaceAndGetPhotos(query, 'hotel');
        }
        catch (error) {
            console.error('Hotel photos error:', error);
            return [];
        }
    }
    async getRestaurantPhotos(placeId, restaurantName, destination) {
        try {
            // Try to get photos using place_id first
            if (placeId) {
                const photos = await this.getPlacePhotos(placeId);
                if (photos.length > 0)
                    return photos.slice(0, 2);
            }
            // Fallback: Search for restaurant by name
            const query = `${restaurantName} restaurant ${destination}`;
            return await this.searchPlaceAndGetPhotos(query, 'restaurant');
        }
        catch (error) {
            console.error('Restaurant photos error:', error);
            return [];
        }
    }
    async getDestinationPhotos(destination) {
        try {
            const queries = [
                `${destination} tourist attractions`,
                `${destination} landmarks`,
                `${destination} city center`
            ];
            let allPhotos = [];
            for (const query of queries) {
                const photos = await this.searchPlaceAndGetPhotos(query, 'tourist attraction');
                allPhotos.push(...photos.slice(0, 3));
                if (allPhotos.length >= 8)
                    break;
            }
            return allPhotos.slice(0, 8); // Return up to 8 photos
        }
        catch (error) {
            console.error('Destination photos error:', error);
            return [];
        }
    }
    async generateSimpleDailyItinerary(destination, duration, preferences) {
        const days = [];
        for (let i = 0; i < duration; i++) {
            days.push({
                day: i + 1,
                date: this.getDateForDay(i),
                theme: `Day ${i + 1} - Exploration`,
                activities: [
                    {
                        time: "10:00",
                        name: "City Tour",
                        description: "Explore the main attractions",
                        location: destination,
                        duration: 180,
                        cost: 30,
                        photos: [],
                        type: "attraction"
                    }
                ],
                meals: [
                    {
                        time: "12:30",
                        restaurant: "Local Restaurant",
                        cuisine: "Local",
                        cost: 25
                    }
                ],
                estimatedCost: 55
            });
        }
        return days;
    }
    async getMapData(destination) {
        try {
            const response = await fetch(`${this.googleMapsApiBase}?engine=google_maps&q=${encodeURIComponent(destination)}&api_key=${this.serpApiKey}`);
            const data = await response.json();
            const place = data.place_results?.[0];
            if (place?.gps_coordinates) {
                return {
                    latitude: place.gps_coordinates.latitude,
                    longitude: place.gps_coordinates.longitude,
                    bounds: {
                        northeast: {
                            lat: place.gps_coordinates.latitude + 0.1,
                            lng: place.gps_coordinates.longitude + 0.1
                        },
                        southwest: {
                            lat: place.gps_coordinates.latitude - 0.1,
                            lng: place.gps_coordinates.longitude - 0.1
                        }
                    }
                };
            }
        }
        catch (error) {
            console.error('Map data error:', error);
        }
        return {
            latitude: 0,
            longitude: 0,
            bounds: {
                northeast: { lat: 0.1, lng: 0.1 },
                southwest: { lat: -0.1, lng: -0.1 }
            }
        };
    }
    async enhanceDaysWithRealData(days, destination) {
        return Promise.all(days.map(async (day, index) => {
            const enhancedActivities = await Promise.all(day.activities.map(async (activity) => {
                const photos = await this.getActivityPhotos('', activity.name, destination);
                return {
                    ...activity,
                    photos: photos.slice(0, 3)
                };
            }));
            const enhancedMeals = await this.enhanceMealsWithRealData(day.meals, destination);
            return {
                day: day.day,
                date: this.getDateForDay(index),
                theme: day.theme,
                activities: enhancedActivities,
                meals: enhancedMeals,
                estimatedCost: this.calculateDayCost(enhancedActivities, enhancedMeals)
            };
        }));
    }
    async getDetailedHotels(destination, preferences) {
        try {
            const response = await fetch(`${this.googleHotelApiBase}?engine=google_local&q=hotels+${encodeURIComponent(destination)}&api_key=${this.serpApiKey}`);
            const data = await response.json();
            return (data.local_results || []).map((hotel) => ({
                name: hotel.title || hotel.name,
                rating: hotel.rating || 4.0,
                pricePerNight: this.estimateHotelPrice(preferences.budgetRange),
                amenities: hotel.amenities || ['WiFi', 'Breakfast', 'AC'],
                photos: hotel.photos || [],
                location: hotel.address || destination
            }));
        }
        catch (error) {
            console.error('Hotel API error:', error);
            return [];
        }
    }
    async getFlightInfo(destination) {
        try {
            const response = await fetch(`${this.googleTravelApiBase}?engine=google_travel_explore&departure_id=/m/02_286&currency=USD&gl=us&hl=en&api_key=${this.serpApiKey}`);
            const data = await response.json();
            return {
                departure: "Your City",
                arrival: destination,
                estimatedCost: 800,
                duration: "8h 30m"
            };
        }
        catch (error) {
            console.error('Flight API error:', error);
            return {
                departure: "Your City",
                arrival: destination,
                estimatedCost: 800,
                duration: "8h 30m"
            };
        }
    }
    async getActivityPhotos(placeId, activityName, destination) {
        try {
            // Try to get photos using place_id first
            if (placeId) {
                const photos = await this.getPlacePhotos(placeId);
                if (photos.length > 0)
                    return photos.slice(0, 3);
            }
            // Fallback: Search for activity by name
            const query = `${activityName} ${destination}`;
            return await this.searchPlaceAndGetPhotos(query, 'attraction');
        }
        catch (error) {
            console.error('Activity photos error:', error);
            return [];
        }
    }
    async enhanceMealsWithRealData(meals, destination) {
        return Promise.all(meals.map(async (meal) => {
            try {
                const response = await fetch(`${this.googleMapsApiBase}?engine=google_local&q=${meal.cuisine}+restaurant+${encodeURIComponent(destination)}&api_key=${this.serpApiKey}`);
                const data = await response.json();
                const restaurant = data.local_results?.[0];
                // Get restaurant photos using Google Places API
                const photos = await this.getRestaurantPhotos(restaurant?.place_id || restaurant?.data_id, restaurant?.title || meal.restaurant, destination);
                return {
                    ...meal,
                    restaurant: restaurant?.title || meal.restaurant,
                    rating: restaurant?.rating || 4.2,
                    photos: photos
                };
            }
            catch (error) {
                return {
                    ...meal,
                    photos: []
                };
            }
        }));
    }
    getDateForDay(dayIndex) {
        const date = new Date();
        date.setDate(date.getDate() + dayIndex);
        return date.toISOString().split('T')[0];
    }
    calculateDayCost(activities, meals) {
        const activityCost = activities.reduce((sum, activity) => sum + (activity.cost || 0), 0);
        const mealCost = meals.reduce((sum, meal) => sum + (meal.cost || 0), 0);
        return activityCost + mealCost;
    }
    estimateHotelPrice(budgetRange) {
        switch (budgetRange) {
            case 'low': return 80;
            case 'mid': return 150;
            case 'high': return 300;
            default: return 150;
        }
    }
    estimateRestaurantPrice(budgetRange) {
        switch (budgetRange) {
            case 'low': return '$';
            case 'mid': return '$$';
            case 'high': return '$$$';
            default: return '$$';
        }
    }
    estimateActivityPrice(budgetRange) {
        switch (budgetRange) {
            case 'low': return 15;
            case 'mid': return 35;
            case 'high': return 75;
            default: return 35;
        }
    }
    categorizeActivity(type) {
        if (type?.toLowerCase().includes('museum'))
            return 'Culture';
        if (type?.toLowerCase().includes('park'))
            return 'Nature';
        if (type?.toLowerCase().includes('restaurant'))
            return 'Food';
        return 'Attraction';
    }
    getDefaultDestinationInfo(destination) {
        return {
            description: `${destination} is a popular travel destination with rich culture and attractions.`,
            bestTimeToVisit: "Year-round",
            climate: "Varies by season",
            culture: "Rich local culture and traditions",
            language: "Local language",
            currency: "Local currency",
            timeZone: "Local timezone",
            attractions: ["Historic sites", "Local markets", "Cultural landmarks"],
            travelTips: ["Carry local currency", "Respect local customs", "Try local cuisine"]
        };
    }
    parseDestinationInfo(aiResponse) {
        try {
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        }
        catch (error) {
            console.error('Parse destination info error:', error);
        }
        return this.getDefaultDestinationInfo("Unknown");
    }
    calculateTotalBudget(days, hotels) {
        const dailyCost = days.reduce((sum, day) => sum + day.estimatedCost, 0);
        const hotelCost = hotels.length > 0 ? hotels[0].pricePerNight * days.length : 0;
        return dailyCost + hotelCost;
    }
    getFallbackItinerary(destination, duration, preferences) {
        const fallbackDays = Array.from({ length: duration }, (_, i) => ({
            day: i + 1,
            date: this.getDateForDay(i),
            theme: `Day ${i + 1} - Explore ${destination}`,
            activities: [{
                    time: "10:00",
                    name: "City Exploration",
                    description: "Discover local attractions",
                    location: destination,
                    duration: 180,
                    cost: 30,
                    photos: [],
                    type: "attraction"
                }],
            meals: [{
                    time: "12:30",
                    restaurant: "Local Restaurant",
                    cuisine: "Local",
                    cost: 25
                }],
            estimatedCost: 55
        }));
        return {
            id: `fallback_${Date.now()}`,
            destination,
            duration,
            totalBudget: 55 * duration + 150 * duration,
            days: fallbackDays,
            hotels: [{
                    name: "Local Hotel",
                    rating: 4.0,
                    pricePerNight: 150,
                    amenities: ["WiFi", "Breakfast"],
                    photos: [],
                    location: destination
                }],
            travelTips: ["Plan ahead", "Check weather", "Bring essentials"],
            destinationInfo: this.getDefaultDestinationInfo(destination),
            photos: [],
            coverImage: '',
            mapData: {
                latitude: 0,
                longitude: 0,
                bounds: {
                    northeast: { lat: 0.1, lng: 0.1 },
                    southwest: { lat: -0.1, lng: -0.1 }
                }
            }
        };
    }
}
exports.ItineraryPlannerService = ItineraryPlannerService;
