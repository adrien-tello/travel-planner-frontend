"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapboxService = void 0;
const database_1 = require("../conf/database");
class MapboxService {
    async getItineraryMapData(itineraryId) {
        // Get itinerary with all related data
        const itinerary = await database_1.prisma.itinerary.findUnique({
            where: { id: itineraryId },
            include: {
                destination: true,
                days: {
                    orderBy: { dayNumber: 'asc' },
                    include: {
                        places: {
                            orderBy: { order: 'asc' },
                            include: {
                                place: true,
                            },
                        },
                    },
                },
            },
        });
        if (!itinerary) {
            throw new Error('Itinerary not found');
        }
        const markers = [];
        const routes = [];
        const coordinates = [];
        // Process each day
        for (const day of itinerary.days) {
            const dayCoordinates = [];
            for (const itineraryPlace of day.places) {
                const place = itineraryPlace.place;
                if (place.latitude && place.longitude) {
                    const coordinate = [place.longitude, place.latitude];
                    coordinates.push(coordinate);
                    dayCoordinates.push(coordinate);
                    // Create marker
                    const marker = {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: coordinate,
                        },
                        properties: {
                            id: place.id,
                            name: place.name,
                            type: place.type,
                            day: day.dayNumber,
                            order: itineraryPlace.order,
                            time: itineraryPlace.startTime || undefined,
                            duration: itineraryPlace.duration || undefined,
                            rating: place.rating || undefined,
                            priceRange: place.priceRange || undefined,
                            description: place.description || undefined,
                            imageUrl: place.imageUrl || undefined,
                        },
                    };
                    markers.push(marker);
                }
            }
            // Create route for the day if there are multiple places
            if (dayCoordinates.length > 1) {
                const route = {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: dayCoordinates,
                    },
                    properties: {
                        day: day.dayNumber,
                        color: this.getDayColor(day.dayNumber),
                    },
                };
                routes.push(route);
            }
        }
        // Calculate bounds and center
        const bounds = this.calculateBounds(coordinates);
        const center = this.calculateCenter(coordinates);
        return {
            center,
            zoom: this.calculateZoom(bounds),
            markers,
            routes,
            bounds,
        };
    }
    async getDestinationMapData(destinationId) {
        const destination = await database_1.prisma.destination.findUnique({
            where: { id: destinationId },
        });
        if (!destination) {
            throw new Error('Destination not found');
        }
        const places = await database_1.prisma.place.findMany({
            where: { destinationId },
            take: 100, // Limit for performance
            orderBy: { rating: 'desc' },
        });
        const markers = places
            .filter(place => place.latitude && place.longitude)
            .map(place => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [place.longitude, place.latitude],
            },
            properties: {
                id: place.id,
                name: place.name,
                type: place.type,
                rating: place.rating || undefined,
                priceRange: place.priceRange || undefined,
                description: place.description || undefined,
                imageUrl: place.imageUrl || undefined,
            },
        }));
        const coordinates = markers.map(m => m.geometry.coordinates);
        const bounds = this.calculateBounds(coordinates);
        return {
            center: [destination.longitude, destination.latitude],
            zoom: 12,
            markers,
            routes: [],
            bounds,
        };
    }
    calculateBounds(coordinates) {
        if (coordinates.length === 0) {
            return { sw: [0, 0], ne: [0, 0] };
        }
        let minLng = coordinates[0][0];
        let maxLng = coordinates[0][0];
        let minLat = coordinates[0][1];
        let maxLat = coordinates[0][1];
        for (const [lng, lat] of coordinates) {
            minLng = Math.min(minLng, lng);
            maxLng = Math.max(maxLng, lng);
            minLat = Math.min(minLat, lat);
            maxLat = Math.max(maxLat, lat);
        }
        return {
            sw: [minLng, minLat],
            ne: [maxLng, maxLat],
        };
    }
    calculateCenter(coordinates) {
        if (coordinates.length === 0) {
            return [0, 0];
        }
        const sumLng = coordinates.reduce((sum, [lng]) => sum + lng, 0);
        const sumLat = coordinates.reduce((sum, [, lat]) => sum + lat, 0);
        return [sumLng / coordinates.length, sumLat / coordinates.length];
    }
    calculateZoom(bounds) {
        const lngDiff = Math.abs(bounds.ne[0] - bounds.sw[0]);
        const latDiff = Math.abs(bounds.ne[1] - bounds.sw[1]);
        const maxDiff = Math.max(lngDiff, latDiff);
        if (maxDiff > 10)
            return 8;
        if (maxDiff > 5)
            return 10;
        if (maxDiff > 2)
            return 12;
        if (maxDiff > 1)
            return 13;
        if (maxDiff > 0.5)
            return 14;
        return 15;
    }
    getDayColor(dayNumber) {
        const colors = [
            '#FF6B6B', // Red
            '#4ECDC4', // Teal
            '#45B7D1', // Blue
            '#96CEB4', // Green
            '#FFEAA7', // Yellow
            '#DDA0DD', // Plum
            '#98D8C8', // Mint
        ];
        return colors[(dayNumber - 1) % colors.length];
    }
}
exports.MapboxService = MapboxService;
