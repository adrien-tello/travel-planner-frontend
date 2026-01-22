import { Router } from 'express';
import { PlacesController } from '../controller/places.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const placesController = new PlacesController();

router.post('/tripadvisor/sync', authMiddleware, placesController.syncTripadvisorPlaces);
router.get('/tripadvisor/:destinationId', authMiddleware, placesController.getTripadvisorPlaces);
router.get('/tripadvisor/:destinationId/:type', authMiddleware, placesController.getPlacesByType);

export default router;