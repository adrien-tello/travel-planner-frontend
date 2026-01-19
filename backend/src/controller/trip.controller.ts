import { Request, Response } from "express";
import { TripService } from "../service/trip.service";
import { AuthenticatedRequest } from "../types/express";

const tripService = new TripService();

export class TripController {
  async createTrip(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const tripData = req.body;

      const trip = await tripService.createTrip(userId, tripData);

      return res.status(201).json({
        success: true,
        message: "Trip created successfully",
        data: trip,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create trip",
      });
    }
  }

  async getUserTrips(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;

      const trips = await tripService.getUserTrips(userId);

      return res.status(200).json({
        success: true,
        data: trips,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to get trips",
      });
    }
  }

  async getTrip(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const tripId = req.params.id;

      const trip = await tripService.getTrip(userId, tripId);

      return res.status(200).json({
        success: true,
        data: trip,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || "Trip not found",
      });
    }
  }

  async updateTrip(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const tripId = req.params.id;
      const updateData = req.body;

      const trip = await tripService.updateTrip(userId, tripId, updateData);

      return res.status(200).json({
        success: true,
        message: "Trip updated successfully",
        data: trip,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update trip",
      });
    }
  }

  async deleteTrip(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const tripId = req.params.id;

      await tripService.deleteTrip(userId, tripId);

      return res.status(200).json({
        success: true,
        message: "Trip deleted successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to delete trip",
      });
    }
  }
}