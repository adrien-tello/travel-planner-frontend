"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLACE_SEARCH_PROMPT = exports.ITINERARY_GENERATION_PROMPT = exports.TRIP_INTENT_PROMPT = void 0;
exports.generateTripIntentPrompt = generateTripIntentPrompt;
exports.generateItineraryPrompt = generateItineraryPrompt;
exports.generatePlaceSearchPrompt = generatePlaceSearchPrompt;
exports.TRIP_INTENT_PROMPT = `
Analyze the following user preferences and trip details.
Summarize the trip intent in a concise structured format.

User Preferences:
- Travel style: {{travelStyle}}
- Budget range: {{budgetRange}}
- Interests: {{interests}}
- Group size: {{groupSize}}
- Traveling with kids: {{travelWithKids}}

Destination:
- City: {{city}}
- Country: {{country}}
- Duration: {{days}} days

Generate a structured summary with:
1. Trip Overview (2-3 sentences)
2. Key Priorities (top 3-5 based on interests and travel style)
3. Budget Considerations (spending focus areas)
4. Pacing Strategy (based on travel style and group composition)
5. Special Accommodations (if traveling with kids or specific needs)

Format the response as JSON:
{
  "overview": "string",
  "priorities": ["string"],
  "budgetFocus": ["string"],
  "pacing": "string",
  "specialNeeds": ["string"]
}
`;
exports.ITINERARY_GENERATION_PROMPT = `
Your task is to generate a realistic, enjoyable, and well-balanced travel itinerary
based on the provided trip context and user preferences.

You MUST respect:
- Budget level
- Travel pace
- Interests
- Group size
- Family-friendliness (if kids are included)
- Logical geography (nearby places per day)

------------------------------------
TRIP CONTEXT (AI-ANALYZED)
------------------------------------
Trip Theme: {{tripTheme}}
Travel Pace: {{pace}}
Budget Sensitivity: {{budgetSensitivity}}
Priority Interests: {{priorityInterests}}

------------------------------------
USER DETAILS
------------------------------------
Group Size: {{groupSize}}
Traveling With Kids: {{travelWithKids}}

------------------------------------
DESTINATION
------------------------------------
City: {{city}}
Country: {{country}}
Duration: {{days}} days

------------------------------------
INSTRUCTIONS
------------------------------------
For each day:
- Assign a clear theme (e.g. Culture Day, Food & City Walk, Adventure Day)
- Recommend:
  - 1 Hotel (for overnight stay)
  - 2–3 Restaurants (breakfast/lunch/dinner)
  - 2–4 Activities or Attractions
- Ensure places match the budget and interests
- Avoid unrealistic scheduling
- Hotels should be reused unless relocation makes sense

------------------------------------
RETURN FORMAT (JSON ONLY)
------------------------------------
{
  "overview": {
    "title": string,
    "summary": string
  },
  "days": [
    {
      "dayNumber": number,
      "title": string,
      "hotel": {
        "name": string,
        "priceRange": "$ | $$ | $$$ | $$$$",
        "reason": string
      },
      "schedule": [
        {
          "type": "RESTAURANT | ACTIVITY | ATTRACTION",
          "name": string,
          "startTime": "HH:MM",
          "endTime": "HH:MM",
          "reason": string
        }
      ]
    }
  ]
}

IMPORTANT RULES:
- Output valid JSON only
- No markdown
- No explanations
- No extra text
`;
exports.PLACE_SEARCH_PROMPT = `
You are a travel intelligence AI.

Your task is to generate precise place-search instructions
that will be used by a backend system to fetch REAL locations
from external services such as Google Places API.

------------------------------------
TRIP CONTEXT
------------------------------------
Trip Theme: {{tripTheme}}
Travel Pace: {{pace}}
Budget Sensitivity: {{budgetSensitivity}}
Priority Interests: {{priorityInterests}}

------------------------------------
DESTINATION
------------------------------------
City: {{city}}
Country: {{country}}
Latitude: {{latitude}}
Longitude: {{longitude}}

------------------------------------
INSTRUCTIONS
------------------------------------
Generate optimized search queries for the following categories:
1. Hotels (lodging)
2. Restaurants (food)
3. Attractions / Activities

Rules:
- Results must match the trip theme and interests
- Respect budget sensitivity
- Prefer highly rated and popular places
- Avoid niche or obscure results unless interests demand it
- Use Google Places–compatible types
- Include search radius in meters
- Limit results to practical counts

------------------------------------
RETURN FORMAT (JSON ONLY)
------------------------------------
{
  "searches": [
    {
      "category": "HOTEL",
      "googleType": "lodging",
      "radius": number,
      "minRating": number,
      "priceLevels": number[],
      "keywords": string[]
    },
    {
      "category": "RESTAURANT",
      "googleType": "restaurant",
      "radius": number,
      "minRating": number,
      "priceLevels": number[],
      "keywords": string[]
    },
    {
      "category": "ACTIVITY",
      "googleType": "tourist_attraction",
      "radius": number,
      "minRating": number,
      "keywords": string[]
    }
  ]
}

------------------------------------
PRICE LEVEL MAPPING
------------------------------------
LOW  → [0,1]
MID  → [1,2]
HIGH → [2,3,4]

IMPORTANT:
- Output valid JSON only
- No markdown
- No explanations
- No extra text
`;
function generateTripIntentPrompt(data) {
    return exports.TRIP_INTENT_PROMPT
        .replace('{{travelStyle}}', data.travelStyle)
        .replace('{{budgetRange}}', data.budgetRange)
        .replace('{{interests}}', data.interests.join(', '))
        .replace('{{groupSize}}', data.groupSize.toString())
        .replace('{{travelWithKids}}', data.travelWithKids ? 'Yes' : 'No')
        .replace('{{city}}', data.city)
        .replace('{{country}}', data.country)
        .replace('{{days}}', data.days.toString());
}
function generateItineraryPrompt(data) {
    return exports.ITINERARY_GENERATION_PROMPT
        .replace('{{tripTheme}}', data.tripTheme)
        .replace('{{pace}}', data.pace)
        .replace('{{budgetSensitivity}}', data.budgetSensitivity)
        .replace('{{priorityInterests}}', data.priorityInterests.join(', '))
        .replace('{{groupSize}}', data.groupSize.toString())
        .replace('{{travelWithKids}}', data.travelWithKids ? 'Yes' : 'No')
        .replace('{{city}}', data.city)
        .replace('{{country}}', data.country)
        .replace('{{days}}', data.days.toString());
}
function generatePlaceSearchPrompt(data) {
    return exports.PLACE_SEARCH_PROMPT
        .replace('{{tripTheme}}', data.tripTheme)
        .replace('{{pace}}', data.pace)
        .replace('{{budgetSensitivity}}', data.budgetSensitivity)
        .replace('{{priorityInterests}}', data.priorityInterests.join(', '))
        .replace('{{city}}', data.city)
        .replace('{{country}}', data.country)
        .replace('{{latitude}}', data.latitude.toString())
        .replace('{{longitude}}', data.longitude.toString());
}
