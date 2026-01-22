"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AITripPlannerService = void 0;
const tripadvisor_service_1 = require("./tripadvisor.service");
const places_sync_service_1 = require("./places-sync.service");
class AITripPlannerService {
    constructor() {
        this.tripadvisorService = new tripadvisor_service_1.TripadvisorService();
        this.placesSyncService = new places_sync_service_1.PlacesSyncService();
    }
    async generateTripSuggestions(preferences) {
        try {
            const destinations = await this.generateDestinationsWithAI(preferences);
            const enhancedSuggestions = await Promise.all(destinations.map(dest => this.enhanceDestinationWithTripadvisor(dest, preferences)));
            return enhancedSuggestions.filter(Boolean).slice(0, 5);
        }
        catch (error) {
            console.error('AI Trip Planning error:', error);
            return this.getFallbackSuggestions(preferences);
        }
    }
    async generateDestinationsWithAI(preferences) {
        const prompt = this.buildDestinationPrompt(preferences);
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return this.parseAIResponse(text);
    }
    async enhanceDestinationWithTripadvisor(destination, preferences) {
        try {
            // Get destination coordinates (you'd need to implement this)
            const coordinates = await this.getDestinationCoordinates(destination.destination);
            if (coordinates) {
                // Sync TripAdvisor data
                const places = await this.placesSyncService.syncPlacesForDestination({
                    destinationId: destination.id,
                    latitude: coordinates.lat,
                    longitude: coordinates.lng,
                    interests: preferences.interests,
                    budgetRange: preferences.budgetRange,
                });
                // Categorize places
                const hotels = places.filter(p => p.type === 'HOTEL').slice(0, 3);
                const restaurants = places.filter(p => p.type === 'RESTAURANT').slice(0, 5);
                const attractions = places.filter(p => p.type === 'ATTRACTION').slice(0, 5);
                return {
                    ...destination,
                    hotels,
                    restaurants,
                    attractions,
                    estimatedBudget: this.calculateBudget(destination, preferences),
                    climate: 'Varies by season',
                    overview: `Discover ${destination.destination} with curated recommendations from TripAdvisor`,
                    localCuisine: restaurants.map(r => r.name).slice(0, 3),
                    transportation: ['Public transport', 'Taxi', 'Walking'],
                    tips: ['Book accommodations early', 'Try local cuisine', 'Check weather'],
                    images: places.filter(p => p.imageUrl).map(p => p.imageUrl).slice(0, 3),
                };
            }
            return destination;
        }
        catch (error) {
            console.error(`Error enhancing ${destination.destination}:`, error);
            return destination;
        }
    }
    async getDestinationCoordinates(destination) {
        // Simple geocoding - in production, use a proper geocoding service
        const cityCoords = {
            'Paris, France': { lat: 48.8566, lng: 2.3522 },
            'Tokyo, Japan': { lat: 35.6762, lng: 139.6503 },
            'New York, USA': { lat: 40.7128, lng: -74.0060 },
            'London, UK': { lat: 51.5074, lng: -0.1278 },
            'Rome, Italy': { lat: 41.9028, lng: 12.4964 },
        };
        return cityCoords[destination] || null;
    }
    calculateBudget(destination, preferences) {
        const baseBudget = {
            low: { daily: 50 },
            mid: { daily: 120 },
            high: { daily: 250 }
        };
        const budget = baseBudget[preferences.budgetRange];
        const duration = destination.duration || 5;
        return Math.round(budget.daily * duration);
    }
    buildDestinationPrompt(preferences) {
        return `As a travel expert, suggest 8 destinations based on these preferences:

    Travel Style: ${preferences.travelStyle}
    Budget: ${preferences.budgetRange}
    Interests: ${preferences.interests.join(', ')}
    Group Size: ${preferences.planning?.groupSize || 1}
    Kids: ${preferences.planning?.travelWithKids || false}

    Return JSON array:
    [{
      "id": "unique_id",
      "destination": "City, Country",
      "country": "Country",
      "duration": 5,
      "highlights": ["attraction1", "attraction2", "attraction3"],
      "bestTimeToVisit": "Season",
      "activities": ["activity1", "activity2", "activity3"],
      "matchScore": 85
    }]`;
    }
    parseAIResponse(response) {
        try {
            const jsonMatch = response.match(/\[.*\]/s);
            return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
        }
        catch (error) {
            console.error('Failed to parse AI response:', error);
            return [];
        }
    }
    getFallbackSuggestions(preferences) {
        const destinations = [
            { name: "Paris, France", country: "France", interests: ["culture", "art", "food"] },
            { name: "Tokyo, Japan", country: "Japan", interests: ["culture", "food", "technology"] },
            { name: "Bali, Indonesia", country: "Indonesia", interests: ["beach", "nature", "wellness"] },
        ];
        return destinations.map((dest, index) => ({
            id: `fallback_${index}`,
            destination: dest.name,
            country: dest.country,
            duration: preferences.travelStyle === 'relaxed' ? 7 : 5,
            estimatedBudget: preferences.budgetRange === 'low' ? 800 : preferences.budgetRange === 'mid' ? 1500 : 3000,
            highlights: ["Historic sites", "Local cuisine", "Cultural experiences"],
            bestTimeToVisit: "Year-round",
            activities: ["Sightseeing", "Food tours", "Cultural activities"],
            matchScore: 75,
            climate: "Temperate climate with mild summers and cool winters",
            overview: "A beautiful destination known for its rich history and culture.",
            localCuisine: ["Local specialties", "Traditional dishes"],
            transportation: ["Public transport", "Walking", "Taxis"],
            tips: ["Check weather", "Book in advance", "Learn basic phrases"],
            images: [],
            hotels: [],
            restaurants: [],
            attractions: [],
        }));
    }
}
exports.AITripPlannerService = AITripPlannerService;
