"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapController = void 0;
const map_service_1 = require("../service/map.service");
class MapController {
    constructor() {
        this.mapService = new map_service_1.MapService();
    }
    async getPlaceLocation(req, res) {
        try {
            const { placeName, city } = req.query;
            if (!placeName || !city) {
                return res.status(400).json({
                    success: false,
                    message: 'Place name and city are required',
                });
            }
            const location = await this.mapService.getPlaceCoordinates(placeName, city);
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
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to get location',
            });
        }
    }
    async getRoute(req, res) {
        try {
            const { originLat, originLng, destLat, destLng } = req.query;
            if (!originLat || !originLng || !destLat || !destLng) {
                return res.status(400).json({
                    success: false,
                    message: 'Origin and destination coordinates are required',
                });
            }
            const origin = {
                latitude: parseFloat(originLat),
                longitude: parseFloat(originLng),
                name: 'Origin',
            };
            const destination = {
                latitude: parseFloat(destLat),
                longitude: parseFloat(destLng),
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
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to get route',
            });
        }
    }
    async getItineraryMap(req, res) {
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
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to get itinerary map data',
            });
        }
    }
}
exports.MapController = MapController;
