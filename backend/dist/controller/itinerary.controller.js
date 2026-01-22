"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItineraryController = void 0;
const places_sync_service_1 = require("../service/places-sync.service");
const tripadvisor_service_1 = require("../service/tripadvisor.service");
const map_service_1 = require("../service/map.service");
const pexels_service_1 = require("../service/pexels.service");
const client_1 = require("@prisma/client");
const placesSyncService = new places_sync_service_1.PlacesSyncService();
const tripadvisorService = new tripadvisor_service_1.TripadvisorService();
const mapService = new map_service_1.MapService();
class ItineraryController {
    async generateItinerary(req, res) {
        console.log('🚀 Itinerary generation request received:', {
            body: req.body,
            method: req.method,
            path: req.path
        });
        try {
            let { city, country, interests, budgetRange, days, destination, duration, travelers, budget } = req.body;
            // Handle legacy format: destination -> city/country, duration -> days
            if (destination && !city && !country) {
                const parts = destination.split(',').map((s) => s.trim());
                if (parts.length >= 2) {
                    city = parts[0];
                    country = parts[1];
                }
                else {
                    city = destination;
                    country = destination;
                }
            }
            if (duration && !days) {
                days = duration;
            }
            // Set defaults if missing
            if (!interests)
                interests = ['culture', 'food', 'sightseeing'];
            if (!budgetRange)
                budgetRange = 'mid';
            console.log('📝 Processed request data:', { city, country, interests, budgetRange, days, travelers, budget });
            // Validate required fields
            const missingFields = [];
            if (!city)
                missingFields.push('city');
            if (!country)
                missingFields.push('country');
            if (!interests || !Array.isArray(interests) || interests.length === 0)
                missingFields.push('interests');
            if (!budgetRange)
                missingFields.push('budgetRange');
            if (!days)
                missingFields.push('days');
            if (missingFields.length > 0) {
                console.log('❌ Validation failed - missing fields:', missingFields);
                return res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${missingFields.join(', ')}`,
                    requiredFields: {
                        city: 'string - destination city',
                        country: 'string - destination country',
                        interests: 'array - user interests (e.g. ["culture", "food", "art"])',
                        budgetRange: 'string - "low", "mid", or "high"',
                        days: 'number - trip duration in days'
                    },
                    alternativeFormat: {
                        destination: 'string - "City, Country" format',
                        duration: 'number - trip duration in days',
                        interests: 'array - optional, defaults to ["culture", "food", "sightseeing"]',
                        budgetRange: 'string - optional, defaults to "mid"'
                    }
                });
            }
            // Validate field types and values
            if (typeof city !== 'string' || city.trim().length === 0) {
                console.log('❌ Invalid city:', city);
                return res.status(400).json({
                    success: false,
                    message: 'City must be a non-empty string'
                });
            }
            if (typeof country !== 'string' || country.trim().length === 0) {
                console.log('❌ Invalid country:', country);
                return res.status(400).json({
                    success: false,
                    message: 'Country must be a non-empty string'
                });
            }
            if (!['low', 'mid', 'high'].includes(budgetRange)) {
                console.log('❌ Invalid budget range:', budgetRange);
                return res.status(400).json({
                    success: false,
                    message: 'Budget range must be "low", "mid", or "high"'
                });
            }
            const numDays = parseInt(days);
            if (isNaN(numDays) || numDays < 1 || numDays > 30) {
                console.log('❌ Invalid days:', days, 'parsed:', numDays);
                return res.status(400).json({
                    success: false,
                    message: 'Days must be a number between 1 and 30'
                });
            }
            console.log('✅ Validation passed, generating itinerary...');
            // Determine lookup string for destination (prefer original destination if provided)
            const destLookup = destination && destination.trim() ? destination.trim() : `${city.trim()}, ${country.trim()}`;
            console.log('🔍 Looking up coordinates for:', destLookup);
            // Get coordinates for the destination (try MapService first, then fallback)
            const coordinates = await getDestinationCoordinates(destLookup);
            console.log('📍 Found coordinates:', coordinates);
            if (!coordinates) {
                console.log('❌ No coordinates found, using default coordinates for', destLookup);
                // Use default coordinates instead of failing
                const defaultCoords = { lat: 48.8566, lng: 2.3522 }; // Paris as default
                console.log('📍 Using default coordinates:', defaultCoords);
                let venues = [];
                try {
                    venues = await placesSyncService.syncPlacesForDestination({
                        destinationId: `temp_${Date.now()}`,
                        latitude: defaultCoords.lat,
                        longitude: defaultCoords.lng,
                        interests,
                        budgetRange: budgetRange,
                        placeTypes: [client_1.PlaceType.HOTEL, client_1.PlaceType.RESTAURANT, client_1.PlaceType.ATTRACTION],
                    });
                    console.log('📍 Generated venues with default coords:', venues.length);
                }
                catch (apiError) {
                    console.warn('⚠️ TripAdvisor API failed, using fallback venues:', apiError);
                    venues = generateFallbackVenues(city, country, numDays);
                }
                // Group venues by type and day
                const itinerary = organizeVenuesByDay(venues, numDays);
                // Collect images from synced venues
                const images = venues.filter((v) => v.imageUrl).map((v) => v.imageUrl).slice(0, 10);
                return res.status(200).json({
                    success: true,
                    data: {
                        id: `itinerary_${Date.now()}`,
                        destination: `${city.trim()}, ${country.trim()}`,
                        duration: numDays,
                        travelers: travelers || 1,
                        budget: budget || null,
                        budgetRange,
                        interests,
                        about: `A carefully crafted ${numDays}-day journey through ${city.trim()}, ${country.trim()}, designed around your interests in ${interests.join(", ")}. This itinerary combines must-see attractions with authentic local experiences.`,
                        itinerary,
                        totalVenues: venues.length,
                        images,
                        summary: {
                            totalCost: itinerary.reduce((sum, day) => sum + day.estimatedCost, 0),
                            accommodations: itinerary[0]?.accommodation ? [itinerary[0].accommodation] : [],
                            highlights: itinerary.map((day) => day.theme),
                            bestTimeToVisit: getBestTimeToVisit(city, country),
                            localCurrency: getLocalCurrency(country),
                            timeZone: getTimeZone(city, country),
                            weatherTips: getWeatherTips(),
                            packingList: getPackingList(interests, numDays)
                        },
                        note: coordinates ? null : 'Generated with default coordinates due to location lookup failure'
                    },
                });
            }
            let venues = [];
            try {
                venues = await placesSyncService.syncPlacesForDestination({
                    destinationId: `temp_${Date.now()}`,
                    latitude: coordinates.lat,
                    longitude: coordinates.lng,
                    interests,
                    budgetRange: budgetRange,
                    placeTypes: [client_1.PlaceType.HOTEL, client_1.PlaceType.RESTAURANT, client_1.PlaceType.ATTRACTION],
                });
                console.log('📍 Generated venues:', venues.length);
            }
            catch (apiError) {
                console.warn('⚠️ TripAdvisor API failed, using fallback venues:', apiError);
                venues = generateFallbackVenues(city, country, numDays);
            }
            // Group venues by type and day
            const itinerary = organizeVenuesByDay(venues, numDays);
            // Collect images from synced venues
            const images = venues.filter((v) => v.imageUrl).map((v) => v.imageUrl).slice(0, 10);
            // Generate cover image and additional destination images
            const coverImage = await generateCoverImage(city, country);
            const destinationImages = await generateDestinationImages(city, country, interests);
            return res.status(200).json({
                success: true,
                data: {
                    destination: `${city.trim()}, ${country.trim()}`,
                    duration: numDays,
                    travelers: travelers || 1,
                    budget: budget || null,
                    about: `A ${numDays}-day trip to ${city.trim()}, ${country.trim()} tailored to your interests: ${interests.join(", ")}.`,
                    coverImage,
                    images: [...destinationImages, ...images],
                    itinerary,
                    totalVenues: venues.length,
                },
            });
        }
        catch (error) {
            console.error('❌ Error generating itinerary:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to generate itinerary',
            });
        }
    }
}
exports.ItineraryController = ItineraryController;
function organizeVenuesByDay(venues, days) {
    const itinerary = [];
    const hotels = venues.filter(v => v.type === 'HOTEL');
    const restaurants = venues.filter(v => v.type === 'RESTAURANT');
    const activities = venues.filter(v => v.type === 'ATTRACTION');
    for (let day = 1; day <= days; day++) {
        const dayDate = new Date(Date.now() + (day - 1) * 24 * 60 * 60 * 1000);
        // Select venues for this day
        const dayActivities = activities.slice((day - 1) * 2, day * 2); // 2 activities per day
        const dayRestaurants = restaurants.slice((day - 1) * 3, day * 3); // 3 meals per day
        const dayHotel = hotels[0] || null; // Same hotel for all days
        // Create detailed schedule with venue images
        const schedule = [
            {
                time: '08:00',
                type: 'meal',
                title: 'Breakfast',
                venue: {
                    name: dayRestaurants[0]?.name || 'Hotel Restaurant',
                    rating: dayRestaurants[0]?.rating || 4.2,
                    priceRange: dayRestaurants[0]?.priceRange || '$$',
                    image: dayRestaurants[0]?.imageUrl
                },
                duration: 60,
                description: 'Start your day with a delicious local breakfast'
            },
            {
                time: '10:00',
                type: 'activity',
                title: dayActivities[0]?.name || 'City Walking Tour',
                venue: {
                    name: dayActivities[0]?.name || 'City Walking Tour',
                    rating: dayActivities[0]?.rating || 4.5,
                    description: dayActivities[0]?.description || 'Explore the city center',
                    image: dayActivities[0]?.imageUrl
                },
                duration: 180,
                description: dayActivities[0]?.description || 'Discover the main attractions and hidden gems'
            },
            {
                time: '13:30',
                type: 'meal',
                title: 'Lunch',
                venue: {
                    name: dayRestaurants[1]?.name || 'Local Bistro',
                    rating: dayRestaurants[1]?.rating || 4.3,
                    priceRange: dayRestaurants[1]?.priceRange || '$$',
                    image: dayRestaurants[1]?.imageUrl
                },
                duration: 90,
                description: 'Enjoy authentic local cuisine'
            },
            {
                time: '15:30',
                type: 'activity',
                title: dayActivities[1]?.name || 'Cultural Experience',
                venue: {
                    name: dayActivities[1]?.name || 'Cultural Experience',
                    rating: dayActivities[1]?.rating || 4.4,
                    description: dayActivities[1]?.description || 'Immerse in local culture',
                    image: dayActivities[1]?.imageUrl
                },
                duration: 150,
                description: dayActivities[1]?.description || 'Experience the local culture and traditions'
            },
            {
                time: '19:00',
                type: 'meal',
                title: 'Dinner',
                venue: {
                    name: dayRestaurants[2]?.name || 'Fine Dining Restaurant',
                    rating: dayRestaurants[2]?.rating || 4.6,
                    priceRange: dayRestaurants[2]?.priceRange || '$$$',
                    image: dayRestaurants[2]?.imageUrl
                },
                duration: 120,
                description: 'End your day with an exquisite dinner experience'
            }
        ];
        itinerary.push({
            day,
            date: dayDate.toISOString().split('T')[0],
            dayOfWeek: dayDate.toLocaleDateString('en-US', { weekday: 'long' }),
            theme: getDayTheme(day, days),
            schedule,
            accommodation: dayHotel ? {
                name: dayHotel.name,
                rating: dayHotel.rating || 4.0,
                amenities: dayHotel.amenities || ['WiFi', 'Breakfast', 'AC'],
                priceRange: dayHotel.priceRange || '$$'
            } : null,
            estimatedCost: calculateDetailedDayCost(schedule),
            tips: getDayTips(day),
            weather: 'Check local weather forecast',
            transportation: getTransportationTips()
        });
    }
    return itinerary;
}
function calculateDetailedDayCost(schedule) {
    return schedule.reduce((total, item) => {
        if (item.type === 'meal') {
            const priceRange = item.venue.priceRange || '$$';
            const mealCosts = { '$': 15, '$$': 35, '$$$': 65, '$$$$': 120 };
            return total + (mealCosts[priceRange] || 35);
        }
        if (item.type === 'activity') {
            return total + 25; // Base activity cost
        }
        return total;
    }, 0);
}
function getDayTheme(day, totalDays) {
    if (day === 1)
        return 'Arrival & City Introduction';
    if (day === totalDays)
        return 'Final Exploration & Departure';
    if (day === 2)
        return 'Cultural Immersion';
    if (day === 3)
        return 'Local Experiences';
    return `Discovery Day ${day}`;
}
function getDayTips(day) {
    const tips = [
        ['Arrive early to avoid crowds', 'Keep your passport handy', 'Try local breakfast specialties'],
        ['Wear comfortable walking shoes', 'Bring a camera for great photos', 'Learn basic local phrases'],
        ['Book restaurant reservations in advance', 'Carry cash for small vendors', 'Stay hydrated throughout the day'],
        ['Check opening hours before visiting', 'Respect local customs and dress codes', 'Keep emergency contacts handy']
    ];
    return tips[Math.min(day - 1, tips.length - 1)];
}
function getTransportationTips() {
    return [
        'Use public transportation for cost-effective travel',
        'Consider walking for short distances to explore',
        'Book taxis through official apps for safety'
    ];
}
function getBestTimeToVisit(city, country) {
    const seasonalInfo = {
        'France': 'April-June, September-October',
        'Japan': 'March-May, September-November',
        'USA': 'April-June, September-November',
        'UK': 'May-September',
        'Italy': 'April-June, September-October',
        'Spain': 'April-June, September-October',
        'Germany': 'May-September',
        'Thailand': 'November-March',
        'Australia': 'September-November, March-May'
    };
    return seasonalInfo[country] || 'Year-round (check local weather)';
}
function getLocalCurrency(country) {
    const currencies = {
        'France': 'Euro (EUR)',
        'Japan': 'Japanese Yen (JPY)',
        'USA': 'US Dollar (USD)',
        'UK': 'British Pound (GBP)',
        'Italy': 'Euro (EUR)',
        'Spain': 'Euro (EUR)',
        'Germany': 'Euro (EUR)',
        'Thailand': 'Thai Baht (THB)',
        'Australia': 'Australian Dollar (AUD)'
    };
    return currencies[country] || 'Local currency';
}
function getTimeZone(city, country) {
    const timeZones = {
        'Paris, France': 'CET (UTC+1)',
        'Tokyo, Japan': 'JST (UTC+9)',
        'New York, USA': 'EST (UTC-5)',
        'London, UK': 'GMT (UTC+0)',
        'Rome, Italy': 'CET (UTC+1)',
        'Barcelona, Spain': 'CET (UTC+1)',
        'Berlin, Germany': 'CET (UTC+1)',
        'Bangkok, Thailand': 'ICT (UTC+7)',
        'Sydney, Australia': 'AEST (UTC+10)'
    };
    return timeZones[`${city}, ${country}`] || 'Local time zone';
}
function getWeatherTips() {
    return [
        'Check weather forecast before departure',
        'Pack layers for temperature changes',
        'Bring rain protection during wet seasons',
        'Stay hydrated in hot climates'
    ];
}
function getPackingList(interests, days) {
    const baseItems = [
        'Comfortable walking shoes',
        'Weather-appropriate clothing',
        'Travel documents and copies',
        'Phone charger and adapter',
        'Basic first aid kit'
    ];
    const interestItems = {
        'culture': ['Camera for museums', 'Notebook for experiences'],
        'food': ['Antacids', 'Food allergy cards'],
        'adventure': ['Comfortable activewear', 'Water bottle'],
        'photography': ['Extra camera batteries', 'Memory cards'],
        'shopping': ['Extra luggage space', 'Currency for markets']
    };
    const additionalItems = interests.flatMap(interest => interestItems[interest] || []);
    if (days > 7) {
        additionalItems.push('Laundry supplies', 'Extra medications');
    }
    return [...baseItems, ...additionalItems];
}
async function getDestinationCoordinates(destination) {
    try {
        // Fallback to static list of common destinations
        const cityCoords = {
            'Paris, France': { lat: 48.8566, lng: 2.3522 },
            'Tokyo, Japan': { lat: 35.6762, lng: 139.6503 },
            'New York, USA': { lat: 40.7128, lng: -74.0060 },
            'London, UK': { lat: 51.5074, lng: -0.1278 },
            'Rome, Italy': { lat: 41.9028, lng: 12.4964 },
            'Barcelona, Spain': { lat: 41.3851, lng: 2.1734 },
            'Amsterdam, Netherlands': { lat: 52.3676, lng: 4.9041 },
            'Berlin, Germany': { lat: 52.5200, lng: 13.4050 },
            'Madrid, Spain': { lat: 40.4168, lng: -3.7038 },
            'Vienna, Austria': { lat: 48.2082, lng: 16.3738 },
            'Prague, Czech Republic': { lat: 50.0755, lng: 14.4378 },
            'Budapest, Hungary': { lat: 47.4979, lng: 19.0402 },
            'Istanbul, Turkey': { lat: 41.0082, lng: 28.9784 },
            'Dubai, UAE': { lat: 25.2048, lng: 55.2708 },
            'Singapore': { lat: 1.3521, lng: 103.8198 },
            'Bangkok, Thailand': { lat: 13.7563, lng: 100.5018 },
            'Sydney, Australia': { lat: -33.8688, lng: 151.2093 },
            'Los Angeles, USA': { lat: 34.0522, lng: -118.2437 },
            'San Francisco, USA': { lat: 37.7749, lng: -122.4194 },
            'Miami, USA': { lat: 25.7617, lng: -80.1918 },
            'Toronto, Canada': { lat: 43.6532, lng: -79.3832 },
            'Vancouver, Canada': { lat: 49.2827, lng: -123.1207 },
            'Mexico City, Mexico': { lat: 19.4326, lng: -99.1332 },
            'Rio de Janeiro, Brazil': { lat: -22.9068, lng: -43.1729 },
            'Buenos Aires, Argentina': { lat: -34.6118, lng: -58.3960 },
            'Cairo, Egypt': { lat: 30.0444, lng: 31.2357 },
            'Cape Town, South Africa': { lat: -33.9249, lng: 18.4241 },
            'Mumbai, India': { lat: 19.0760, lng: 72.8777 },
            'Delhi, India': { lat: 28.7041, lng: 77.1025 },
            'Beijing, China': { lat: 39.9042, lng: 116.4074 },
            'Shanghai, China': { lat: 31.2304, lng: 121.4737 },
            'Seoul, South Korea': { lat: 37.5665, lng: 126.9780 },
            'Osaka, Japan': { lat: 34.6937, lng: 135.5023 },
            'Hong Kong': { lat: 22.3193, lng: 114.1694 },
            'Kuala Lumpur, Malaysia': { lat: 3.1390, lng: 101.6869 },
            'Jakarta, Indonesia': { lat: -6.2088, lng: 106.8456 },
            'Manila, Philippines': { lat: 14.5995, lng: 120.9842 },
        };
        // Try exact match first
        if (cityCoords[destination]) {
            return cityCoords[destination];
        }
        // Try partial matches (case insensitive)
        const lowerDest = destination.toLowerCase();
        for (const [key, coords] of Object.entries(cityCoords)) {
            if (key.toLowerCase().includes(lowerDest) || lowerDest.includes(key.toLowerCase().split(',')[0])) {
                return coords;
            }
        }
        return null;
    }
    catch (err) {
        console.error('Geocoding error for', destination, err);
        return null;
    }
}
function generateFallbackVenues(city, country, days) {
    const venues = [];
    // Generate hotels with Pexels images
    venues.push({
        id: 'hotel-1',
        name: `${city} Grand Hotel`,
        type: 'HOTEL',
        rating: 4.2,
        priceRange: '$$',
        amenities: ['WiFi', 'Breakfast', 'AC', 'Gym'],
        imageUrl: `https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400`
    });
    // Generate restaurants with Pexels images
    const restaurantTypes = ['Local Bistro', 'Traditional Restaurant', 'Fine Dining', 'Cafe', 'Street Food'];
    const restaurantImages = [
        'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400'
    ];
    for (let i = 0; i < days * 3; i++) {
        venues.push({
            id: `restaurant-${i + 1}`,
            name: `${restaurantTypes[i % restaurantTypes.length]} ${i + 1}`,
            type: 'RESTAURANT',
            rating: 4.0 + Math.random() * 0.8,
            priceRange: ['$', '$$', '$$$'][Math.floor(Math.random() * 3)],
            imageUrl: restaurantImages[i % restaurantImages.length]
        });
    }
    // Generate attractions with Pexels images
    const attractionTypes = ['Museum', 'Historic Site', 'Park', 'Gallery', 'Monument', 'Market'];
    const attractionImages = [
        'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=400'
    ];
    for (let i = 0; i < days * 2; i++) {
        venues.push({
            id: `attraction-${i + 1}`,
            name: `${city} ${attractionTypes[i % attractionTypes.length]} ${i + 1}`,
            type: 'ATTRACTION',
            rating: 4.1 + Math.random() * 0.7,
            description: `Popular ${attractionTypes[i % attractionTypes.length].toLowerCase()} in ${city}`,
            imageUrl: attractionImages[i % attractionImages.length]
        });
    }
    return venues;
}
// Image generation functions using Pexels API
async function generateCoverImage(city, country) {
    try {
        const images = await pexels_service_1.PexelsService.searchImages(`${city} ${country} landmark`, 1);
        if (images.length > 0) {
            return images[0];
        }
    }
    catch (error) {
        console.error('Pexels API error for cover image:', error);
    }
    // Fallback to curated destination images
    const fallbackImages = {
        'Paris, France': 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800',
        'Tokyo, Japan': 'https://images.pexels.com/photos/248195/pexels-photo-248195.jpeg?auto=compress&cs=tinysrgb&w=800',
        'New York, USA': 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=800',
        'London, UK': 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800',
    };
    const destination = `${city}, ${country}`;
    return fallbackImages[destination] || 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800';
}
async function generateDestinationImages(city, country, interests) {
    const images = [];
    try {
        // Generate images based on city and interests
        const queries = [
            `${city} ${country} architecture`,
            `${city} ${country} street`,
            `${city} ${country} culture`,
            ...interests.map(interest => `${city} ${interest}`)
        ];
        for (const query of queries.slice(0, 3)) {
            try {
                const queryImages = await pexels_service_1.PexelsService.searchImages(query, 2);
                images.push(...queryImages);
                // Rate limiting - wait 200ms between requests
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            catch (error) {
                console.error(`Pexels API error for query "${query}":`, error);
            }
        }
    }
    catch (error) {
        console.error('Pexels API error:', error);
    }
    // Fallback images if API fails
    if (images.length === 0) {
        images.push('https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=400');
    }
    return images.slice(0, 6); // Limit to 6 images
}
