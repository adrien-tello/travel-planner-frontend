import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
});

export interface TripData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  itinerary?: any;
}

export class TripService {
  async createTrip(userId: string, tripData: TripData) {
    return await prisma.trip.create({
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

  async getUserTrips(userId: string) {
    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return trips.map(trip => ({
      ...trip,
      itinerary: trip.itinerary ? JSON.parse(trip.itinerary) : null,
    }));
  }

  async getTrip(userId: string, tripId: string) {
    const trip = await prisma.trip.findFirst({
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

  async updateTrip(userId: string, tripId: string, updateData: Partial<TripData>) {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      throw new Error("Trip not found");
    }

    return await prisma.trip.update({
      where: { id: tripId },
      data: {
        ...updateData,
        itinerary: updateData.itinerary ? JSON.stringify(updateData.itinerary) : undefined,
      },
    });
  }

  async deleteTrip(userId: string, tripId: string) {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      throw new Error("Trip not found");
    }

    return await prisma.trip.delete({
      where: { id: tripId },
    });
  }
}