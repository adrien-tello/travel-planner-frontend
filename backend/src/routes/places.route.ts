import { Router } from 'express';
import { PlacesController } from '../controller/places.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const placesController = new PlacesController();

router.get('/hotels', authMiddleware, (req, res) => placesController.getHotels(req, res));
router.get('/restaurants', authMiddleware, (req, res) => placesController.getRestaurants(req, res));
router.get('/activities', authMiddleware, (req, res) => placesController.getActivities(req, res));

export default router;
