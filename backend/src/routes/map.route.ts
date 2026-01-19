import { Router } from 'express';
import { MapController } from '../controller/map.controller';

const router = Router();
const mapController = new MapController();

router.get('/health', (req, res) => {
  res.json({ status: 'Map service is running' });
});

router.get('/location', (req, res) => mapController.getPlaceLocation(req, res));
router.get('/route', (req, res) => mapController.getRoute(req, res));
router.post('/itinerary', (req, res) => mapController.getItineraryMap(req, res));

export default router;