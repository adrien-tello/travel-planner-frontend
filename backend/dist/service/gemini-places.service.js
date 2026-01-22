"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiPlacesService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const google_places_service_1 = require("./google-places.service");
class GeminiPlacesService {
    constructor() {
        this.genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.placesService = new google_places_service_1.GooglePlacesService();
    }
    async generateItineraryWithRealVenues(request) {
        try {
            // Step 1: Generate venue suggestions with Gemini
            const suggestions = await this.generateVenueSuggestions(request);
            // Step 2: Find real places for each suggestion
            const realVenues = await Promise.all(suggestions.map(async (suggestion) => {
                const places = await this.placesService.searchPlaces(suggestion.name, `${request.city}, ${request.country}`, this.mapVenueType(suggestion.type));
                return {
                    ...suggestion,
                    details: places[0] || null,
                };
            }));
            return realVenues.filter(venue => venue.details);
        }
        catch (error) {
            console.error('Error generating itinerary with real venues:', error);
            return [];
        }
    }
    async generateVenueSuggestions(request) {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `Generate a ${request.days}-day itinerary for ${request.city}, ${request.country}.
    
    User preferences:
    - Interests: ${request.interests.join(', ')}
    - Budget: ${request.budgetRange}
    
    For each day, suggest:
    - 2-3 restaurants (breakfast, lunch, dinner)
    - 1 hotel (if multi-day)
    - 2-4 activities/attractions
    
    Return as JSON array with this format:
    [{
      "name": "venue name",
      "type": "restaurant|hotel|activity",
      "description": "brief description",
      "recommendedTime": "morning|afternoon|evening",
      "estimatedCost": number
    }]
    
    Focus on popular, well-known places that actually exist.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        try {
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        }
        catch (error) {
            console.error('Error parsing Gemini response:', error);
        }
        return [];
    }
    mapVenueType(type) {
        switch (type) {
            case 'restaurant':
                return 'restaurant';
            case 'hotel':
                return 'lodging';
            case 'activity':
            default:
                return 'tourist_attraction';
        }
    }
}
exports.GeminiPlacesService = GeminiPlacesService;
