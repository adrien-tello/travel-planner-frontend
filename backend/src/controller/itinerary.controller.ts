import { Request, Response } from 'express';
import { GeminiPlacesService } from '../service/gemini-places.service';

const geminiPlacesService = new GeminiPlacesService();

export class ItineraryController {
  async generateItinerary(req: Request, res: Response) {
    try {
      const { city, country, interests, budgetRange, days } = req.body;

      if (!city || !country || !interests || !budgetRange || !days) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: city, country, interests, budgetRange, days',
        });
      }

      const venues = await geminiPlacesService.generateItineraryWithRealVenues({
        city,
        country,
        interests,
        budgetRange,
        days: parseInt(days),
      });

      // Group venues by type and day
      const itinerary = this.organizeVenuesByDay(venues, parseInt(days));

      return res.status(200).json({
        success: true,
        data: {
          destination: `${city}, ${country}`,
          duration: days,
          itinerary,
          totalVenues: venues.length,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to generate itinerary',
      });
    }
  }

  private organizeVenuesByDay(venues: any[], days: number) {
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
}