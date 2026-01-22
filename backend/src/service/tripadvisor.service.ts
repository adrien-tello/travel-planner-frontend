import axios, { AxiosInstance } from 'axios';
import { PlaceType } from '@prisma/client';

export interface TripadvisorPlace {
  location_id: string;
  name: string;
  latitude: string;
  longitude: string;
  address_obj: {
    street1?: string;
    city?: string;
    country?: string;
    postalcode?: string;
  };
  rating: string;
  price_level?: string;
  category: {
    key: string;
    name: string;
  };
  subcategory: Array<{
    key: string;
    name: string;
  }>;
  photo?: {
    images: {
      medium: { url: string };
    };
  };
  web_url: string;
  phone?: string;
  website?: string;
}

export interface TripadvisorSearchParams {
  latitude: number;
  longitude: number;
  category: 'hotels' | 'restaurants' | 'attractions' | 'geos';
  radius?: number;
  limit?: number;
  currency?: string;
  lang?: string;
}

export interface NormalizedPlace {
  externalId: string;
  name: string;
  type: PlaceType;
  latitude: number;
  longitude: number;
  address?: string;
  rating?: number;
  priceRange?: string;
  imageUrl?: string;
  website?: string;
  phone?: string;
  description?: string;
  amenities: string[];
  tags: string[];
}

export class TripadvisorService {
  private client: AxiosInstance;
  private readonly baseUrl = 'https://api.content.tripadvisor.com/api/v1';
  private enabled: boolean;

  constructor() {
    const apiKey = process.env.TRIPADVISOR_API_KEY;
    this.enabled = !!apiKey;

    if (!this.enabled) {
      console.warn('TripadvisorService: TRIPADVISOR_API_KEY not set - Tripadvisor lookups will be disabled.');
      this.client = axios.create({
        baseURL: this.baseUrl,
        headers: { 'Accept': 'application/json' },
        timeout: 10000,
      });
      return;
    }

    this.client = axios.create({
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

  async searchNearby(params: TripadvisorSearchParams): Promise<TripadvisorPlace[]> {
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
    } catch (error) {
      console.error('Tripadvisor API error:', error);
      throw new Error(`Failed to fetch ${params.category} from Tripadvisor`);
    }
  }

  normalizePlace(place: TripadvisorPlace, type: PlaceType): NormalizedPlace {
    const latitude = parseFloat(place.latitude);
    const longitude = parseFloat(place.longitude);
    const rating = place.rating ? parseFloat(place.rating) : undefined;

    const addressParts = [];
    if (place.address_obj.street1) addressParts.push(place.address_obj.street1);
    if (place.address_obj.city) addressParts.push(place.address_obj.city);
    if (place.address_obj.country) addressParts.push(place.address_obj.country);

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

  private normalizePriceLevel(priceLevel?: string): string {
    if (!priceLevel) return '$';
    
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

  mapCategoryToPlaceType(category: string): PlaceType {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower === 'hotels') return PlaceType.HOTEL;
    if (categoryLower === 'restaurants') return PlaceType.RESTAURANT;
    if (categoryLower === 'attractions') return PlaceType.ATTRACTION;
    
    return PlaceType.ATTRACTION;
  }

  filterByBudget(places: NormalizedPlace[], budgetRange: 'low' | 'mid' | 'high'): NormalizedPlace[] {
    const budgetMap = {
      low: ['$', '$$'],
      mid: ['$$', '$$$'],
      high: ['$$$', '$$$$'],
    };

    const allowedPrices = budgetMap[budgetRange];
    return places.filter(place => 
      !place.priceRange || allowedPrices.includes(place.priceRange)
    );
  }

  filterByInterests(places: NormalizedPlace[], interests: string[]): NormalizedPlace[] {
    if (!interests.length) return places;

    return places.filter(place => 
      interests.some(interest => 
        place.tags.some(tag => 
          tag.toLowerCase().includes(interest.toLowerCase())
        )
      )
    );
  }
}