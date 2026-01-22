"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GooglePlacesService = void 0;
class GooglePlacesService {
    constructor() {
        this.apiKey = process.env.GOOGLE_PLACES_API_KEY;
    }
    async searchPlaces(query, location, type) {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + ' ' + location)}&type=${type}&key=${this.apiKey}`);
            const data = await response.json();
            if (data.results) {
                const places = await Promise.all(data.results.slice(0, 5).map(async (place) => {
                    const details = await this.getPlaceDetails(place.place_id);
                    return {
                        placeId: place.place_id,
                        name: place.name,
                        address: place.formatted_address,
                        latitude: place.geometry.location.lat,
                        longitude: place.geometry.location.lng,
                        rating: place.rating || 0,
                        priceLevel: place.price_level || 0,
                        photos: await this.getPlacePhotos(place.photos || []),
                        types: place.types,
                        ...details,
                    };
                }));
                return places;
            }
            return [];
        }
        catch (error) {
            console.error('Error searching places:', error);
            return [];
        }
    }
    async getPlaceDetails(placeId) {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_hours,formatted_phone_number,website&key=${this.apiKey}`);
            const data = await response.json();
            return {
                openingHours: data.result?.opening_hours?.weekday_text,
                phoneNumber: data.result?.formatted_phone_number,
                website: data.result?.website,
            };
        }
        catch (error) {
            console.error('Error getting place details:', error);
            return {};
        }
    }
    async getPlacePhotos(photos) {
        if (!photos || photos.length === 0)
            return [];
        return photos.slice(0, 3).map((photo) => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${this.apiKey}`);
    }
}
exports.GooglePlacesService = GooglePlacesService;
