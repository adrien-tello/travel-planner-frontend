import { Request, Response } from 'express';
import { PlacesService } from '../service/places.service';

const placesService = new PlacesService();

export class PlacesController {
  async getHotels(req: Request, res: Response) {
    try {
      const { destination, budgetRange } = req.query;
      
      if (!destination) {
        return res.status(400).json({ error: 'Destination is required' });
      }

      const hotels = await placesService.getHotels(
        destination as string,
        budgetRange as string
      );

      res.json({ hotels });
    } catch (error) {
      console.error('Get hotels error:', error);
      res.status(500).json({ error: 'Failed to fetch hotels' });
    }
  }

  async getRestaurants(req: Request, res: Response) {
    try {
      const { destination, budgetRange, cuisine } = req.query;
      
      if (!destination) {
        return res.status(400).json({ error: 'Destination is required' });
      }

      const restaurants = await placesService.getRestaurants(
        destination as string,
        budgetRange as string,
        cuisine as string
      );

      res.json({ restaurants });
    } catch (error) {
      console.error('Get restaurants error:', error);
      res.status(500).json({ error: 'Failed to fetch restaurants' });
    }
  }

  async getActivities(req: Request, res: Response) {
    try {
      const { destination, budgetRange, interests } = req.query;
      
      if (!destination) {
        return res.status(400).json({ error: 'Destination is required' });
      }

      const interestsArray = interests 
        ? (interests as string).split(',') 
        : undefined;

      const activities = await placesService.getActivities(
        destination as string,
        budgetRange as string,
        interestsArray
      );

      res.json({ activities });
    } catch (error) {
      console.error('Get activities error:', error);
      res.status(500).json({ error: 'Failed to fetch activities' });
    }
  }
}
