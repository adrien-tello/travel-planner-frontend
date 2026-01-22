"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacesController = void 0;
const places_sync_service_1 = require("../service/places-sync.service");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const syncPlacesSchema = zod_1.z.object({
    destinationId: zod_1.z.string(),
    latitude: zod_1.z.number(),
    longitude: zod_1.z.number(),
    interests: zod_1.z.array(zod_1.z.string()).optional(),
    budgetRange: zod_1.z.enum(['low', 'mid', 'high']).optional(),
    placeTypes: zod_1.z.array(zod_1.z.nativeEnum(client_1.PlaceType)).optional(),
});
class PlacesController {
    constructor() {
        this.syncTripadvisorPlaces = async (req, res) => {
            try {
                const validatedData = syncPlacesSchema.parse(req.body);
                const places = await this.placesSyncService.syncPlacesForDestination(validatedData);
                res.json({
                    success: true,
                    data: places,
                    message: `Synced ${places.length} places from Tripadvisor`,
                });
            }
            catch (error) {
                console.error('Sync places error:', error);
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to sync places',
                });
            }
        };
        this.getTripadvisorPlaces = async (req, res) => {
            try {
                const { destinationId } = req.params;
                const { placeTypes } = req.query;
                const parsedPlaceTypes = placeTypes
                    ? (Array.isArray(placeTypes) ? placeTypes : [placeTypes]).map(type => type)
                    : undefined;
                const places = await this.placesSyncService.getCachedPlaces(destinationId, parsedPlaceTypes);
                res.json({
                    success: true,
                    data: places,
                    message: `Found ${places.length} cached places`,
                });
            }
            catch (error) {
                console.error('Get places error:', error);
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to get places',
                });
            }
        };
        this.getPlacesByType = async (req, res) => {
            try {
                const { destinationId, type } = req.params;
                if (!Object.values(client_1.PlaceType).includes(type)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid place type',
                    });
                }
                const places = await this.placesSyncService.getCachedPlaces(destinationId, [type]);
                res.json({
                    success: true,
                    data: places,
                    message: `Found ${places.length} ${type.toLowerCase()} places`,
                });
            }
            catch (error) {
                console.error('Get places by type error:', error);
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to get places by type',
                });
            }
        };
        this.placesSyncService = new places_sync_service_1.PlacesSyncService();
    }
}
exports.PlacesController = PlacesController;
