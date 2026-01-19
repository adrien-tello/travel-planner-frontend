import { Request, Response } from 'express';
import { GeminiPlacesService } from '../service/gemini-places.service';

const geminiPlacesService = new GeminiPlacesService();

export class ItineraryController {
  async generateItinerary(req: Request, res: Response) {
    console.log('🚀 Itinerary generation request received:', {
      body: req.body,
      method: req.method,
      path: req.path
    });

    try {
      let { city, country, interests, budgetRange, days, destination, duration } = req.body;

      // Handle legacy format: destination -> city/country, duration -> days
      if (destination && !city && !country) {
        const parts = destination.split(',').map((s: string) => s.trim());
        if (parts.length >= 2) {
          city = parts[0];
          country = parts[1];
        } else {
          city = destination;
          country = destination;
        }
      }
      
      if (duration && !days) {
        days = duration;
      }

      // Set defaults if missing
      if (!interests) interests = ['culture', 'food', 'sightseeing'];
      if (!budgetRange) budgetRange = 'mid';

      console.log('📝 Processed request data:', { city, country, interests, budgetRange, days });

      // Validate required fields
      const missingFields = [];
      if (!city) missingFields.push('city');
      if (!country) missingFields.push('country');
      if (!interests || !Array.isArray(interests) || interests.length === 0) missingFields.push('interests');
      if (!budgetRange) missingFields.push('budgetRange');
      if (!days) missingFields.push('days');

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

      const venues = await geminiPlacesService.generateItineraryWithRealVenues({
        city: city.trim(),
        country: country.trim(),
        interests,
        budgetRange,
        days: numDays,
      });

      console.log('📍 Generated venues:', venues.length);

      // Group venues by type and day
      const itinerary = organizeVenuesByDay(venues, numDays);

      return res.status(200).json({
        success: true,
        data: {
          destination: `${city.trim()}, ${country.trim()}`,
          duration: numDays,
          itinerary,
          totalVenues: venues.length,
        },
      });
    } catch (error: any) {
      console.error('❌ Error generating itinerary:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to generate itinerary',
      });
    }
  }
}

function organizeVenuesByDay(venues: any[], days: number) {
  const itinerary = [];
  const venuesPerDay = Math.ceil(venues.length / days);

  for (let day = 1; day <= days; day++) {
    const startIndex = (day - 1) * venuesPerDay;
    const dayVenues = venues.slice(startIndex, startIndex + venuesPerDay);

    const hotels = dayVenues.filter(v => v.type === 'hotel');
    const restaurants = dayVenues.filter(v => v.type === 'restaurant');
    const activities = dayVenues.filter(v => v.type === 'activity');

    itinerary.push({
      day,
      date: new Date(Date.now() + (day - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hotels,
      restaurants,
      activities,
      estimatedCost: dayVenues.reduce((sum, v) => sum + (v.estimatedCost || 0), 0),
    });
  }

  return itinerary;
}