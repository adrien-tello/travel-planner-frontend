"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacesSyncService = void 0;
const client_1 = require("@prisma/client");
const tripadvisor_service_1 = require("./tripadvisor.service");
const database_1 = require("../conf/database");
class PlacesSyncService {
    constructor() {
        this.tripadvisorService = new tripadvisor_service_1.TripadvisorService();
    }
    async syncPlacesForDestination(params) {
        const { destinationId, latitude, longitude, interests = [], budgetRange = 'mid', placeTypes = [client_1.PlaceType.HOTEL, client_1.PlaceType.RESTAURANT, client_1.PlaceType.ATTRACTION], } = params;
        const allPlaces = [];
        for (const placeType of placeTypes) {
            try {
                const category = this.mapPlaceTypeToCategory(placeType);
                const tripadvisorPlaces = await this.tripadvisorService.searchNearby({
                    latitude,
                    longitude,
                    category,
                    radius: 15000,
                    limit: 50,
                });
                let normalizedPlaces = tripadvisorPlaces.map(place => this.tripadvisorService.normalizePlace(place, placeType));
                if (budgetRange) {
                    normalizedPlaces = this.tripadvisorService.filterByBudget(normalizedPlaces, budgetRange);
                }
                if (interests.length > 0) {
                    normalizedPlaces = this.tripadvisorService.filterByInterests(normalizedPlaces, interests);
                }
                const syncedPlaces = await this.syncPlacesToDatabase(normalizedPlaces, destinationId);
                allPlaces.push(...syncedPlaces);
                await this.delay(1000);
            }
            catch (error) {
                console.error(`Error syncing ${placeType} places:`, error);
            }
        }
        return allPlaces;
    }
    async syncPlacesToDatabase(places, destinationId) {
        const syncedPlaces = [];
        for (const place of places) {
            try {
                const existingPlace = await database_1.prisma.place.findFirst({
                    where: {
                        OR: [
                            { externalId: place.externalId, source: 'TRIPADVISOR' },
                            {
                                AND: [
                                    { name: place.name },
                                    { latitude: { gte: place.latitude - 0.001, lte: place.latitude + 0.001 } },
                                    { longitude: { gte: place.longitude - 0.001, lte: place.longitude + 0.001 } },
                                ],
                            },
                        ],
                    },
                });
                if (existingPlace) {
                    const updatedPlace = await database_1.prisma.place.update({
                        where: { id: existingPlace.id },
                        data: {
                            name: place.name,
                            rating: place.rating,
                            priceRange: place.priceRange,
                            imageUrl: place.imageUrl,
                            website: place.website,
                            phone: place.phone,
                            description: place.description,
                            amenities: place.amenities,
                            tags: place.tags,
                            updatedAt: new Date(),
                        },
                    });
                    syncedPlaces.push(updatedPlace);
                }
                else {
                    const newPlace = await database_1.prisma.place.create({
                        data: {
                            name: place.name,
                            type: place.type,
                            destinationId,
                            address: place.address,
                            latitude: place.latitude,
                            longitude: place.longitude,
                            description: place.description,
                            imageUrl: place.imageUrl,
                            rating: place.rating,
                            priceRange: place.priceRange,
                            website: place.website,
                            phone: place.phone,
                            amenities: place.amenities,
                            tags: place.tags,
                            externalId: place.externalId,
                            source: 'TRIPADVISOR',
                        },
                    });
                    syncedPlaces.push(newPlace);
                }
            }
            catch (error) {
                console.error(`Error syncing place ${place.name}:`, error);
            }
        }
        return syncedPlaces;
    }
    async getCachedPlaces(destinationId, placeTypes) {
        const whereClause = { destinationId };
        if (placeTypes && placeTypes.length > 0) {
            whereClause.type = { in: placeTypes };
        }
        return await database_1.prisma.place.findMany({
            where: whereClause,
            orderBy: [
                { rating: 'desc' },
                { createdAt: 'desc' },
            ],
        });
    }
    mapPlaceTypeToCategory(placeType) {
        switch (placeType) {
            case client_1.PlaceType.HOTEL:
                return 'hotels';
            case client_1.PlaceType.RESTAURANT:
                return 'restaurants';
            case client_1.PlaceType.ATTRACTION:
            case client_1.PlaceType.ACTIVITY:
                return 'attractions';
            default:
                return 'attractions';
        }
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.PlacesSyncService = PlacesSyncService;
