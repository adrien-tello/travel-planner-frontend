import { UserPreferences } from "../types/prefrences";

export interface TripSuggestion {
  id: string;
  destination: string;
  country: string;
  duration: number;
  estimatedBudget: number;
  highlights: string[];
  bestTimeToVisit: string;
  activities: string[];
  matchScore: number;
  hotels?: any[];
  photos?: string[];
  localAttractions?: any[];
}

export class AITripPlannerService {
  private geminiApiKey = process.env.GEMINI_API_KEY;
  private serpApiKey = "demo"; // Using demo key from URLs
  private googlePhotosApiBase = process.env.GOOGLE_PHOTO_API_KEY?.split('?')[0] || "https://serpapi.com/search.json";

  async generateTripSuggestions(preferences: UserPreferences): Promise<TripSuggestion[]> {
    try {
      // Step 1: Get AI-generated destinations from Gemini
      const aiDestinations = await this.getGeminiDestinations(preferences);
      
      // Step 2: Enhance each destination with real data
      const enhancedSuggestions = await Promise.all(
        aiDestinations.map(dest => this.enhanceDestinationData(dest, preferences))
      );
      
      return enhancedSuggestions.filter(Boolean).slice(0, 5);
    } catch (error) {
      console.error('AI Trip Planning error:', error);
      return this.getFallbackSuggestions(preferences);
    }
  }

  private async getGeminiDestinations(preferences: UserPreferences): Promise<any[]> {
    const prompt = this.buildGeminiPrompt(preferences);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;
    return this.parseAIResponse(aiResponse);
  }

  private async enhanceDestinationData(destination: any, preferences: UserPreferences): Promise<TripSuggestion> {
    try {
      // Get place data first to get data_id for photos
      const placeData = await this.getPlaceData(destination.destination);
      
      // Get hotels, photos, and attractions in parallel
      const [hotels, photos, attractions] = await Promise.all([
        this.getHotels(destination.destination),
        this.getDestinationPhotos(placeData?.data_id, destination.destination),
        this.getLocalAttractions(destination.destination)
      ]);

      return {
        ...destination,
        hotels: hotels.slice(0, 3),
        photos: photos.slice(0, 5),
        localAttractions: attractions.slice(0, 5),
        estimatedBudget: this.calculateBudget(destination, preferences, hotels)
      };
    } catch (error) {
      console.error(`Error enhancing ${destination.destination}:`, error);
      return destination;
    }
  }

  private async getHotels(destination: string): Promise<any[]> {
    try {
      const response = await fetch(`https://serpapi.com/search.json?engine=google_local&q=hotels+${encodeURIComponent(destination)}&api_key=${this.serpApiKey}`);
      const data = await response.json();
      return data.local_results || [];
    } catch (error) {
      console.error('Hotel API error:', error);
      return [];
    }
  }

  private async getPlaceData(destination: string): Promise<any> {
    try {
      const response = await fetch(`https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(destination)}&api_key=${this.serpApiKey}`);
      const data = await response.json();
      return data.place_results?.[0] || null;
    } catch (error) {
      console.error('Place data API error:', error);
      return null;
    }
  }

  private async getDestinationPhotos(dataId: string | null, destination: string): Promise<string[]> {
    try {
      if (dataId) {
        // Use Google Photos API with data_id
        const response = await fetch(`${this.googlePhotosApiBase}?engine=google_maps_photos&data_id=${dataId}&api_key=${this.serpApiKey}`);
        const data = await response.json();
        return data.photos?.map((p: any) => p.image) || [];
      } else {
        // Fallback to maps search for photos
        const response = await fetch(`https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(destination)}&api_key=${this.serpApiKey}`);
        const data = await response.json();
        return data.place_results?.photos?.map((p: any) => p.image) || [];
      }
    } catch (error) {
      console.error('Photos API error:', error);
      return [];
    }
  }

  private async getLocalAttractions(destination: string): Promise<any[]> {
    try {
      const response = await fetch(`https://serpapi.com/search.json?engine=google_local&q=attractions+${encodeURIComponent(destination)}&api_key=${this.serpApiKey}`);
      const data = await response.json();
      return data.local_results || [];
    } catch (error) {
      console.error('Attractions API error:', error);
      return [];
    }
  }

  private calculateBudget(destination: any, preferences: UserPreferences, hotels: any[]): number {
    const baseBudget = {
      low: { daily: 50, accommodation: 80 },
      mid: { daily: 120, accommodation: 150 },
      high: { daily: 250, accommodation: 300 }
    };

    const budget = baseBudget[preferences.budgetRange as keyof typeof baseBudget];
    const duration = destination.duration || 5;
    
    // Factor in actual hotel prices if available
    const avgHotelPrice = hotels.length > 0 
      ? hotels.reduce((sum, h) => sum + (h.price || budget.accommodation), 0) / hotels.length
      : budget.accommodation;

    return Math.round((budget.daily * duration) + (avgHotelPrice * duration));
  }

  private buildGeminiPrompt(preferences: UserPreferences): string {
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

  private parseAIResponse(response: string): any[] {
    try {
      const jsonMatch = response.match(/\[.*\]/s);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return [];
    }
  }

  private getFallbackSuggestions(preferences: UserPreferences): TripSuggestion[] {
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
    }));
  }
}