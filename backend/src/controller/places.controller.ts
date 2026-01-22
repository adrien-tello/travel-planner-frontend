import { Request, Response } from 'express';
import { PlacesSyncService } from '../service/places-sync.service';
import { PlaceType } from '@prisma/client';
import { z } from 'zod';

const syncPlacesSchema = z.object({
  destinationId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  interests: z.array(z.string()).optional(),
  budgetRange: z.enum(['low', 'mid', 'high']).optional(),
  placeTypes: z.array(z.nativeEnum(PlaceType)).optional(),
});

export class PlacesController {
  private placesSyncService: PlacesSyncService;

  constructor() {
    this.placesSyncService = new PlacesSyncService();
  }

  syncTripadvisorPlaces = async (req: Request, res: Response) => {
    try {
      const validatedData = syncPlacesSchema.parse(req.body);

      const places = await this.placesSyncService.syncPlacesForDestination(validatedData);

      res.json({
        success: true,
        data: places,
        message: `Synced ${places.length} places from Tripadvisor`,
      });
    } catch (error: any) {
      console.error('Sync places error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to sync places',
      });
    }
  };

  getTripadvisorPlaces = async (req: Request, res: Response) => {
    try {
      const { destinationId } = req.params;
      const { placeTypes } = req.query;

      const parsedPlaceTypes = placeTypes 
        ? (Array.isArray(placeTypes) ? placeTypes : [placeTypes]).map(type => type as PlaceType)
        : undefined;

      const places = await this.placesSyncService.getCachedPlaces(destinationId, parsedPlaceTypes);

      res.json({
        success: true,
        data: places,
        message: `Found ${places.length} cached places`,
      });
    } catch (error: any) {
      console.error('Get places error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get places',
      });
    }
  };

  getPlacesByType = async (req: Request, res: Response) => {
    try {
      const { destinationId, type } = req.params;
      
      if (!Object.values(PlaceType).includes(type as PlaceType)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid place type',
        });
      }

      const places = await this.placesSyncService.getCachedPlaces(destinationId, [type as PlaceType]);

      res.json({
        success: true,
        data: places,
        message: `Found ${places.length} ${type.toLowerCase()} places`,
      });
    } catch (error: any) {
      console.error('Get places by type error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get places by type',
      });
    }
  };
}