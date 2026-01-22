"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripService = void 0;
const database_1 = require("../conf/database");
class TripService {
    async createTrip(userId, tripData) {
        return await database_1.prisma.trip.create({
            data: {
                userId,
                destination: tripData.destination,
                startDate: tripData.startDate,
                endDate: tripData.endDate,
                budget: tripData.budget,
                itinerary: tripData.itinerary ? JSON.stringify(tripData.itinerary) : null,
            },
        });
    }
    async getUserTrips(userId) {
        const trips = await database_1.prisma.trip.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        return trips.map((trip) => ({
            ...trip,
            itinerary: trip.itinerary ? JSON.parse(trip.itinerary) : null,
        }));
    }
    async getTrip(userId, tripId) {
        const trip = await database_1.prisma.trip.findFirst({
            where: { id: tripId, userId },
        });
        if (!trip) {
            throw new Error("Trip not found");
        }
        return {
            ...trip,
            itinerary: trip.itinerary ? JSON.parse(trip.itinerary) : null,
        };
    }
    async updateTrip(userId, tripId, updateData) {
        const trip = await database_1.prisma.trip.findFirst({
            where: { id: tripId, userId },
        });
        if (!trip) {
            throw new Error("Trip not found");
        }
        return await database_1.prisma.trip.update({
            where: { id: tripId },
            data: {
                ...updateData,
                itinerary: updateData.itinerary ? JSON.stringify(updateData.itinerary) : undefined,
            },
        });
    }
    async deleteTrip(userId, tripId) {
        const trip = await database_1.prisma.trip.findFirst({
            where: { id: tripId, userId },
        });
        if (!trip) {
            throw new Error("Trip not found");
        }
        return await database_1.prisma.trip.delete({
            where: { id: tripId },
        });
    }
}
exports.TripService = TripService;
