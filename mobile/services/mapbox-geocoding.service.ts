export interface MapboxPlace {
  id: string;
  place_name: string;
  center: [number, number]; // [longitude, latitude]
  place_type: string[];
  properties: {
    category?: string;
  };
}

export interface SearchResult {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  type: string;
}

export class MapboxGeocodingService {
  private static readonly MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
  private static readonly BASE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  static async searchPlaces(query: string): Promise<SearchResult[]> {
    if (!this.MAPBOX_TOKEN) {
      throw new Error('Mapbox access token not configured');
    }

    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const encodedQuery = encodeURIComponent(query.trim());
      const url = `${this.BASE_URL}/${encodedQuery}.json?access_token=${this.MAPBOX_TOKEN}&limit=5&types=poi,place,address`;

      const response = await fetch(url);
      const data = await response.json();

      if (!data.features || data.features.length === 0) {
        return [];
      }

      return data.features.map((feature: MapboxPlace) => ({
        name: this.extractPlaceName(feature.place_name),
        latitude: feature.center[1],
        longitude: feature.center[0],
        address: feature.place_name,
        type: this.getPlaceType(feature)
      }));
    } catch (error) {
      console.error('Mapbox geocoding error:', error);
      throw new Error('Failed to search places');
    }
  }

  private static extractPlaceName(fullName: string): string {
    return fullName.split(',')[0].trim();
  }

  private static getPlaceType(feature: MapboxPlace): string {
    if (feature.place_type.includes('poi')) {
      const category = feature.properties?.category;
      if (category?.includes('hotel') || category?.includes('lodging')) return 'hotel';
      if (category?.includes('restaurant') || category?.includes('food')) return 'restaurant';
      return 'attraction';
    }
    if (feature.place_type.includes('place')) return 'city';
    return 'location';
  }
}