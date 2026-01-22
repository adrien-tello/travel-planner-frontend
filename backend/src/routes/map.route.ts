import { Router } from 'express';
import { MapController } from '../controller/map.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const mapController = new MapController();

router.get('/location', mapController.getPlaceLocation.bind(mapController));
router.get('/route', mapController.getRoute.bind(mapController));
router.post('/itinerary', mapController.getItineraryMap.bind(mapController));

export default router;