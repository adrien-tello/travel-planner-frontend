"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripController = void 0;
const trip_service_1 = require("../service/trip.service");
const tripService = new trip_service_1.TripService();
class TripController {
    async createTrip(req, res) {
        try {
            const userId = req.user.userId;
            const tripData = req.body;
            const trip = await tripService.createTrip(userId, tripData);
            return res.status(201).json({
                success: true,
                message: "Trip created successfully",
                data: trip,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to create trip",
            });
        }
    }
    async getUserTrips(req, res) {
        try {
            const userId = req.user.userId;
            const trips = await tripService.getUserTrips(userId);
            return res.status(200).json({
                success: true,
                data: trips,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to get trips",
            });
        }
    }
    async getTrip(req, res) {
        try {
            const userId = req.user.userId;
            const tripId = req.params.id;
            const trip = await tripService.getTrip(userId, tripId);
            return res.status(200).json({
                success: true,
                data: trip,
            });
        }
        catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message || "Trip not found",
            });
        }
    }
    async updateTrip(req, res) {
        try {
            const userId = req.user.userId;
            const tripId = req.params.id;
            const updateData = req.body;
            const trip = await tripService.updateTrip(userId, tripId, updateData);
            return res.status(200).json({
                success: true,
                message: "Trip updated successfully",
                data: trip,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to update trip",
            });
        }
    }
    async deleteTrip(req, res) {
        try {
            const userId = req.user.userId;
            const tripId = req.params.id;
            await tripService.deleteTrip(userId, tripId);
            return res.status(200).json({
                success: true,
                message: "Trip deleted successfully",
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to delete trip",
            });
        }
    }
}
exports.TripController = TripController;
