import { generateTripIntentPrompt, generateItineraryPrompt, TripIntentSummary, ItineraryGenerationResponse } from '../utils/ai-prompts';

const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiApiBase = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

export interface ItineraryRequest {
  travelStyle: 'relaxed' | 'moderate' | 'packed';
  budgetRange: 'low' | 'mid' | 'high';
  interests: string[];
  groupSize: number;
  travelWithKids: boolean;
  city: string;
  country: string;
  days: number;
}

export interface DestinationInfo {
  overview: string;
  climate: string;
  bestTimeToVisit: string;
  activities: string[];
  localCuisine: string[];
  transportation: string[];
  tips: string[];
}

export interface ItineraryWithImages {
  itinerary: ItineraryGenerationResponse;
  destinationInfo: DestinationInfo;
  images: string[];
}

export class OpenAIService {
  async generateItinerary(request: ItineraryRequest): Promise<ItineraryWithImages> {
    // Step 1: Analyze trip intent
    const tripIntent = await this.analyzeTripIntent(request);

    // Step 2: Get destination information
    const destinationInfo = await this.getDestinationInfo(request.city, request.country);

    // Step 3: Generate itinerary
    const itinerary = await this.createItinerary(request, tripIntent);

    // Step 4: Generate destination images
    const images = await this.generateDestinationImages(request.city, request.country, request.interests);

    return {
      itinerary,
      destinationInfo,
      images,
    };
  }

  private async analyzeTripIntent(request: ItineraryRequest): Promise<TripIntentSummary> {
    if (!geminiApiKey) throw new Error('Gemini API not configured');
    const prompt = generateTripIntentPrompt(request);

    const response = await fetch(`${geminiApiBase}?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    return JSON.parse(content);
  }

  async getDestinationInfo(city: string, country: string): Promise<DestinationInfo> {
    if (!geminiApiKey) throw new Error('Gemini API not configured');
    const prompt = `Provide comprehensive travel information about ${city}, ${country}:

1. Overview (2-3 sentences about the destination)
2. Climate (weather patterns and seasons)
3. Best time to visit
4. Top activities and attractions
5. Local cuisine highlights
6. Transportation options
7. Travel tips

Return as JSON:
{
  "overview": "string",
  "climate": "string",
  "bestTimeToVisit": "string",
  "activities": ["string"],
  "localCuisine": ["string"],
  "transportation": ["string"],
  "tips": ["string"]
}`;

    const response = await fetch(`${geminiApiBase}?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    return JSON.parse(content);
  }

  private async createItinerary(
    request: ItineraryRequest,
    tripIntent: TripIntentSummary
  ): Promise<ItineraryGenerationResponse> {
    if (!geminiApiKey) throw new Error('Gemini API not configured');
    const prompt = generateItineraryPrompt({
      tripTheme: tripIntent.overview,
      pace: request.travelStyle.toUpperCase() as 'RELAXED' | 'MODERATE' | 'PACKED',
      budgetSensitivity: request.budgetRange.toUpperCase() as 'LOW' | 'MID' | 'HIGH',
      priorityInterests: tripIntent.priorities,
      groupSize: request.groupSize,
      travelWithKids: request.travelWithKids,
      city: request.city,
      country: request.country,
      days: request.days,
    });

    const response = await fetch(`${geminiApiBase}?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    return JSON.parse(content);
  }

  async generateDestinationImages(
    city: string,
    country: string,
    interests: string[]
  ): Promise<string[]> {
    return [];
  }

  async generateItineraryImage(itinerary: ItineraryGenerationResponse): Promise<string> {
    return '';
  }
}
