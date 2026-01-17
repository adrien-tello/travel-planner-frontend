import { Router } from 'express';
import { ItineraryController } from '../controller/itinerary.controller';

const router = Router();
const itineraryController = new ItineraryController();

router.post('/generate', itineraryController.generateItinerary);

export default router;