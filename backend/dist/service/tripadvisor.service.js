"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripadvisorService = void 0;
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
class TripadvisorService {
    constructor() {
        this.baseUrl = 'https://api.content.tripadvisor.com/api/v1';
        const apiKey = process.env.TRIPADVISOR_API_KEY;
        this.enabled = !!apiKey;
        if (!this.enabled) {
            console.warn('TripadvisorService: TRIPADVISOR_API_KEY not set - Tripadvisor lookups will be disabled.');
            this.client = axios_1.default.create({
                baseURL: this.baseUrl,
                headers: { 'Accept': 'application/json' },
                timeout: 10000,
            });
            return;
        }
        this.client = axios_1.default.create({
            baseURL: this.baseUrl,
            headers: {
                'Accept': 'application/json',
            },
            params: {
                key: apiKey,
            },
            timeout: 10000,
        });
    }
    async searchNearby(params) {
        try {
            if (!this.enabled) {
                console.warn('TripadvisorService.searchNearby called but Tripadvisor API key is not configured. Returning empty results.');
                return [];
            }
            const endpoint = `/location/${params.latitude},${params.longitude}/nearby_search`;
            const response = await this.client.get(endpoint, {
                params: {
                    category: params.category,
                    radius: params.radius || 10000,
                    limit: params.limit || 30,
                    currency: params.currency || 'USD',
                    lang: params.lang || 'en',
                },
            });
            return response.data.data || [];
        }
        catch (error) {
            console.error('Tripadvisor API error:', error);
            throw new Error(`Failed to fetch ${params.category} from Tripadvisor`);
        }
    }
    normalizePlace(place, type) {
        const latitude = parseFloat(place.latitude);
        const longitude = parseFloat(place.longitude);
        const rating = place.rating ? parseFloat(place.rating) : undefined;
        const addressParts = [];
        if (place.address_obj.street1)
            addressParts.push(place.address_obj.street1);
        if (place.address_obj.city)
            addressParts.push(place.address_obj.city);
        if (place.address_obj.country)
            addressParts.push(place.address_obj.country);
        const amenities = place.subcategory?.map(sub => sub.name) || [];
        const tags = [place.category.name, ...amenities];
        return {
            externalId: place.location_id,
            name: place.name,
            type,
            latitude,
            longitude,
            address: addressParts.join(', '),
            rating,
            priceRange: this.normalizePriceLevel(place.price_level),
            imageUrl: place.photo?.images?.medium?.url,
            website: place.website,
            phone: place.phone,
            description: `${place.category.name} in ${place.address_obj.city || 'Unknown'}`,
            amenities,
            tags,
        };
    }
    normalizePriceLevel(priceLevel) {
        if (!priceLevel)
            return '$';
        switch (priceLevel.toLowerCase()) {
            case '$':
            case 'inexpensive':
                return '$';
            case '$$':
            case 'moderate':
                return '$$';
            case '$$$':
            case 'expensive':
                return '$$$';
            case '$$$$':
            case 'very expensive':
                return '$$$$';
            default:
                return '$';
        }
    }
    mapCategoryToPlaceType(category) {
        const categoryLower = category.toLowerCase();
        if (categoryLower === 'hotels')
            return client_1.PlaceType.HOTEL;
        if (categoryLower === 'restaurants')
            return client_1.PlaceType.RESTAURANT;
        if (categoryLower === 'attractions')
            return client_1.PlaceType.ATTRACTION;
        return client_1.PlaceType.ATTRACTION;
    }
    filterByBudget(places, budgetRange) {
        const budgetMap = {
            low: ['$', '$$'],
            mid: ['$$', '$$$'],
            high: ['$$$', '$$$$'],
        };
        const allowedPrices = budgetMap[budgetRange];
        return places.filter(place => !place.priceRange || allowedPrices.includes(place.priceRange));
    }
    filterByInterests(places, interests) {
        if (!interests.length)
            return places;
        return places.filter(place => interests.some(interest => place.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))));
    }
}
exports.TripadvisorService = TripadvisorService;
