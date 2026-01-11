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
}

export class AITripPlannerService {
  private geminiApiKey = process.env.GEMINI_API_KEY;

  async generateTripSuggestions(preferences: UserPreferences): Promise<TripSuggestion[]> {
    const prompt = this.buildPrompt(preferences);
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      return this.parseAIResponse(aiResponse);
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.getFallbackSuggestions(preferences);
    }
  }

  private buildPrompt(preferences: UserPreferences): string {
    return `Generate 5 personalized travel destination suggestions based on these preferences:
    
    Travel Style: ${preferences.travelStyle}
    Budget Range: ${preferences.budgetRange}
    Interests: ${preferences.interests.join(', ')}
    Group Size: ${preferences.planning?.groupSize || 1}
    Travel with Kids: ${preferences.planning?.travelWithKids || false}
    
    For each destination, provide:
    - Destination name and country
    - Duration (3-7 days based on travel style)
    - Estimated budget in USD
    - 3 main highlights
    - 3 relevant activities
    - Match score (0-100)
    
    Return as JSON array with this structure:
    [{
      "id": "unique_id",
      "destination": "City Name",
      "country": "Country",
      "duration": 5,
      "estimatedBudget": 1500,
      "highlights": ["highlight1", "highlight2", "highlight3"],
      "bestTimeToVisit": "Season",
      "activities": ["activity1", "activity2", "activity3"],
      "matchScore": 85
    }]`;
  }

  private parseAIResponse(response: string): TripSuggestion[] {
    try {
      const jsonMatch = response.match(/\[.*\]/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }
    return [];
  }

  private getFallbackSuggestions(preferences: UserPreferences): TripSuggestion[] {
    const destinations = [
      { name: "Paris", country: "France", budget: { low: 800, mid: 1500, high: 3000 }, interests: ["culture", "art", "food", "romance"] },
      { name: "Tokyo", country: "Japan", budget: { low: 1000, mid: 2000, high: 4000 }, interests: ["culture", "food", "technology", "shopping"] },
      { name: "Bali", country: "Indonesia", budget: { low: 600, mid: 1200, high: 2500 }, interests: ["beach", "nature", "wellness", "adventure"] },
    ];

    return destinations.map(dest => ({
      id: `trip_${dest.name.toLowerCase()}`,
      destination: dest.name,
      country: dest.country,
      duration: preferences.travelStyle === 'relaxed' ? 7 : 5,
      estimatedBudget: dest.budget[preferences.budgetRange as keyof typeof dest.budget],
      highlights: ["Historic sites", "Local cuisine", "Cultural experiences"],
      bestTimeToVisit: "Year-round",
      activities: ["Sightseeing", "Food tours", "Cultural activities"],
      matchScore: 75,
    }));
  }
}