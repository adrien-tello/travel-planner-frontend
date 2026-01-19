export interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  priceLevel: number;
  photos: string[];
  types: string[];
  openingHours?: string[];
  phoneNumber?: string;
  website?: string;
}

export class GooglePlacesService {
  private apiKey = process.env.GOOGLE_PLACES_API_KEY;

  async searchPlaces(query: string, location: string, type: 'restaurant' | 'lodging' | 'tourist_attraction'): Promise<PlaceDetails[]> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + ' ' + location)}&type=${type}&key=${this.apiKey}`
      );

      const data = await response.json();

      if (data.results) {
        const places = await Promise.all(
          data.results.slice(0, 5).map(async (place: any) => {
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
          })
        );
        return places;
      }

      return [];
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  }

  private async getPlaceDetails(placeId: string) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_hours,formatted_phone_number,website&key=${this.apiKey}`
      );

      const data = await response.json();

      return {
        openingHours: data.result?.opening_hours?.weekday_text,
        phoneNumber: data.result?.formatted_phone_number,
        website: data.result?.website,
      };
    } catch (error) {
      console.error('Error getting place details:', error);
      return {};
    }
  }

  private async getPlacePhotos(photos: any[]): Promise<string[]> {
    if (!photos || photos.length === 0) return [];

    return photos.slice(0, 3).map((photo: any) => 
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${this.apiKey}`
    );
  }
}