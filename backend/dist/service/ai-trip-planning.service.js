"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AITripPlanningService = void 0;
const client_1 = require("@prisma/client");
const places_sync_service_1 = require("./places-sync.service");
const openai_service_1 = require("./openai.service");
const database_1 = require("../conf/database");
class AITripPlanningService {
    constructor() {
        this.placesSyncService = new places_sync_service_1.PlacesSyncService();
        this.openAIService = new openai_service_1.OpenAIService();
    }
    async planTrip(request) {
        // 1. Get destination info
        const destination = await database_1.prisma.destination.findUnique({
            where: { id: request.destinationId },
        });
        if (!destination) {
            throw new Error('Destination not found');
        }
        // 2. Ensure we have fresh Tripadvisor data
        await this.ensurePlacesData(request);
        // 3. Get cached places
        const places = await this.placesSyncService.getCachedPlaces(request.destinationId);
        // 4. Filter places by budget and interests
        const filteredPlaces = this.filterPlacesByPreferences(places, request);
        // 5. Generate itinerary using AI
        const aiItinerary = await this.generateAIItinerary(request, destination, filteredPlaces);
        // 6. Persist itinerary to database
        const persistedItinerary = await this.persistItinerary(request, aiItinerary);
        return persistedItinerary;
    }
    async ensurePlacesData(request) {
        const destination = await database_1.prisma.destination.findUnique({
            where: { id: request.destinationId },
        });
        if (!destination)
            return;
        // Check if we have recent data (less than 7 days old)
        const recentPlaces = await database_1.prisma.place.findFirst({
            where: {
                destinationId: request.destinationId,
                source: 'TRIPADVISOR',
                updatedAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
                },
            },
        });
        // If no recent data, sync from Tripadvisor
        if (!recentPlaces) {
            console.log('Syncing fresh Tripadvisor data...');
            await this.placesSyncService.syncPlacesForDestination({
                destinationId: request.destinationId,
                latitude: destination.latitude,
                longitude: destination.longitude,
                interests: request.interests,
                budgetRange: request.budgetRange,
            });
        }
    }
    filterPlacesByPreferences(places, request) {
        return places.filter(place => {
            // Budget filter
            const budgetMap = {
                low: ['$', '$$'],
                mid: ['$$', '$$$'],
                high: ['$$$', '$$$$'],
            };
            const allowedPrices = budgetMap[request.budgetRange];
            if (place.priceRange && !allowedPrices.includes(place.priceRange)) {
                return false;
            }
            // Interest filter
            if (request.interests.length > 0) {
                const hasMatchingInterest = request.interests.some(interest => place.tags.some((tag) => tag.toLowerCase().includes(interest.toLowerCase())));
                if (!hasMatchingInterest)
                    return false;
            }
            // Rating filter (minimum 3.0)
            if (place.rating && place.rating < 3.0) {
                return false;
            }
            return true;
        });
    }
    async generateAIItinerary(request, destination, places) {
        const days = Math.ceil((request.endDate.getTime() - request.startDate.getTime()) / (1000 * 60 * 60 * 24));
        // Group places by type
        const hotels = places.filter(p => p.type === client_1.PlaceType.HOTEL);
        const restaurants = places.filter(p => p.type === client_1.PlaceType.RESTAURANT);
        const attractions = places.filter(p => p.type === client_1.PlaceType.ATTRACTION);
        const activities = places.filter(p => p.type === client_1.PlaceType.ACTIVITY);
        const prompt = `
You are an expert travel planner. Create a detailed ${days}-day itinerary for ${destination.name}, ${destination.country}.

TRAVELER PROFILE:
- ${request.travelers} traveler(s)
- Budget: $${request.budget} (${request.budgetRange} range)
- Travel Style: ${request.travelStyle}
- Interests: ${request.interests.join(', ')}

AVAILABLE PLACES (USE ONLY THESE):

HOTELS (${hotels.length} available):
${hotels.slice(0, 10).map(h => `- ${h.name} (${h.rating}★, ${h.priceRange}) - ${h.address}`).join('\n')}

RESTAURANTS (${restaurants.length} available):
${restaurants.slice(0, 15).map(r => `- ${r.name} (${r.rating}★, ${r.priceRange}) - ${r.tags.join(', ')}`).join('\n')}

ATTRACTIONS (${attractions.length} available):
${attractions.slice(0, 20).map(a => `- ${a.name} (${a.rating}★) - ${a.description}`).join('\n')}

ACTIVITIES (${activities.length} available):
${activities.slice(0, 15).map(a => `- ${a.name} (${a.rating}★) - ${a.description}`).join('\n')}

REQUIREMENTS:
1. ONLY use places from the lists above
2. Select 1 hotel for the entire stay
3. Plan ${days} days with 2-3 activities per day
4. Include breakfast, lunch, and dinner recommendations
5. Consider travel time between locations
6. Match the ${request.travelStyle} pace
7. Stay within ${request.budgetRange} budget range

Return JSON format:
{
  "hotel": {
    "name": "Selected hotel name",
    "reason": "Why this hotel fits"
  },
  "days": [
    {
      "day": 1,
      "date": "${request.startDate.toISOString().split('T')[0]}",
      "theme": "Day theme",
      "activities": [
        {
          "time": "09:00",
          "type": "attraction",
          "name": "Place name from list",
          "duration": 120,
          "reason": "Why visit"
        }
      ],
      "meals": [
        {
          "type": "breakfast",
          "name": "Restaurant name from list",
          "time": "08:00"
        }
      ]
    }
  ]
}`;
        const aiResponse = await this.openAIService.generateItinerary({
            tripTheme: `${days}-day trip to ${destination.name}`,
            pace: request.travelStyle,
            budgetSensitivity: request.budgetRange.toUpperCase(),
            priorityInterests: request.interests,
            groupSize: request.travelers,
            travelWithKids: false,
            city: destination.city || destination.name,
            country: destination.country,
            days,
        });
        return aiResponse;
    }
    async persistItinerary(request, aiItinerary) {
        // Create main itinerary
        const itinerary = await database_1.prisma.itinerary.create({
            data: {
                userId: request.userId,
                destinationId: request.destinationId,
                title: `${aiItinerary.title || 'AI Generated Trip'}`,
                description: aiItinerary.description || 'Generated by AI using Tripadvisor data',
                startDate: request.startDate,
                endDate: request.endDate,
                budget: request.budget,
                budgetRange: request.budgetRange.toUpperCase(),
                travelers: request.travelers,
                travelStyle: request.travelStyle,
                interests: request.interests,
                status: 'DRAFT',
                aiGenerated: true,
            },
        });
        // Create itinerary days and places
        const days = [];
        const places = [];
        if (aiItinerary.days) {
            for (let i = 0; i < aiItinerary.days.length; i++) {
                const dayData = aiItinerary.days[i];
                const itineraryDay = await database_1.prisma.itineraryDay.create({
                    data: {
                        itineraryId: itinerary.id,
                        dayNumber: i + 1,
                        date: new Date(dayData.date || request.startDate.getTime() + i * 24 * 60 * 60 * 1000),
                        title: dayData.theme || `Day ${i + 1}`,
                        description: dayData.description,
                    },
                });
                days.push(itineraryDay);
                // Add activities and meals as places
                const allActivities = [
                    ...(dayData.activities || []),
                    ...(dayData.meals || []),
                ];
                for (let j = 0; j < allActivities.length; j++) {
                    const activity = allActivities[j];
                    // Find the place in our database
                    const dbPlace = await database_1.prisma.place.findFirst({
                        where: {
                            name: { contains: activity.name, mode: 'insensitive' },
                            destinationId: request.destinationId,
                        },
                    });
                    if (dbPlace) {
                        const itineraryPlace = await database_1.prisma.itineraryPlace.create({
                            data: {
                                itineraryId: itinerary.id,
                                dayId: itineraryDay.id,
                                placeId: dbPlace.id,
                                order: j + 1,
                                startTime: activity.time,
                                duration: activity.duration,
                                notes: activity.reason || activity.description,
                            },
                        });
                        places.push(itineraryPlace);
                    }
                }
            }
        }
        return {
            itinerary,
            days,
            places,
        };
    }
}
exports.AITripPlanningService = AITripPlanningService;
