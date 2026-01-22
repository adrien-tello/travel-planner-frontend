import { Request, Response } from 'express';
import { MapService } from '../service/map.service';

export class MapController {
  private mapService: MapService;

  constructor() {
    this.mapService = new MapService();
  }

  async getPlaceLocation(req: Request, res: Response) {
    try {
      const { placeName, city } = req.query;

      if (!placeName || !city) {
        return res.status(400).json({
          success: false,
          message: 'Place name and city are required',
        });
      }

      const location = await this.mapService.getPlaceCoordinates(
        placeName as string,
        city as string
      );

      if (!location) {
        return res.status(404).json({
          success: false,
          message: 'Location not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: location,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get location',
      });
    }
  }

  async getRoute(req: Request, res: Response) {
    try {
      const { originLat, originLng, destLat, destLng } = req.query;

      if (!originLat || !originLng || !destLat || !destLng) {
        return res.status(400).json({
          success: false,
          message: 'Origin and destination coordinates are required',
        });
      }

      const origin = {
        latitude: parseFloat(originLat as string),
        longitude: parseFloat(originLng as string),
        name: 'Origin',
      };

      const destination = {
        latitude: parseFloat(destLat as string),
        longitude: parseFloat(destLng as string),
        name: 'Destination',
      };

      const route = await this.mapService.getRoute(origin, destination);

      if (!route) {
        return res.status(404).json({
          success: false,
          message: 'Route not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: route,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get route',
      });
    }
  }
  async getItineraryMap(req: Request, res: Response) {
    try {
      const { places, city } = req.body;

      if (!places || !Array.isArray(places)) {
        return res.status(400).json({
          success: false,
          message: 'Places array is required',
        });
      }

      const mapData = await this.mapService.getItineraryMapData(places);

      return res.status(200).json({
        success: true,
        data: mapData,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get itinerary map data',
      });
    }
  }
}