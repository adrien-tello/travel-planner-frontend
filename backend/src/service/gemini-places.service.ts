import { GoogleGenerativeAI } from '@google/generative-ai';
import { GooglePlacesService, PlaceDetails } from './google-places.service';

export interface VenueRequest {
  city: string;
  country: string;
  interests: string[];
  budgetRange: 'low' | 'mid' | 'high';
  days: number;
}

export interface GeneratedVenue {
  name: string;
  type: 'restaurant' | 'hotel' | 'activity';
  description: string;
  recommendedTime: string;
  estimatedCost: number;
  details?: PlaceDetails;
}

export class GeminiPlacesService {
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  private placesService = new GooglePlacesService();

  async generateItineraryWithRealVenues(request: VenueRequest): Promise<GeneratedVenue[]> {
    try {
      // Step 1: Generate venue suggestions with Gemini
      const suggestions = await this.generateVenueSuggestions(request);
      
      // Step 2: Find real places for each suggestion
      const realVenues = await Promise.all(
        suggestions.map(async (suggestion) => {
          const places = await this.placesService.searchPlaces(
            suggestion.name,
            `${request.city}, ${request.country}`,
            this.mapVenueType(suggestion.type)
          );
          
          return {
            ...suggestion,
            details: places[0] || null,
          };
        })
      );

      return realVenues.filter(venue => venue.details);
    } catch (error) {
      console.error('Error generating itinerary with real venues:', error);
      return [];
    }
  }

  private async generateVenueSuggestions(request: VenueRequest): Promise<Omit<GeneratedVenue, 'details'>[]> {
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
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
    }

    return [];
  }

  private mapVenueType(type: string): 'restaurant' | 'lodging' | 'tourist_attraction' {
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