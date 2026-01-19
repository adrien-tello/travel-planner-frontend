export class PlacesService {
  private serpApiKey = process.env.SERP_API_KEY || "demo";
  private googleMapsApiBase = "https://serpapi.com/search.json";

  async getHotels(destination: string, budgetRange: string = 'mid') {
    try {
      const response = await fetch(`${this.googleMapsApiBase}?engine=google_local&q=hotels+${encodeURIComponent(destination)}&api_key=${this.serpApiKey}`);
      const data = await response.json();
      
      return (data.local_results || []).slice(0, 20).map((hotel: any) => ({
        id: hotel.place_id || hotel.data_id,
        name: hotel.title || hotel.name,
        rating: hotel.rating || 4.0,
        pricePerNight: this.estimateHotelPrice(budgetRange),
        amenities: hotel.amenities || ['WiFi', 'Breakfast', 'AC'],
        photos: [],
        location: hotel.address || destination,
        coordinates: {
          lat: hotel.gps_coordinates?.latitude || 0,
          lng: hotel.gps_coordinates?.longitude || 0
        },
        placeId: hotel.place_id || hotel.data_id
      }));
    } catch (error) {
      console.error('Hotels API error:', error);
      return [];
    }
  }

  async getRestaurants(destination: string, budgetRange: string = 'mid', cuisine?: string) {
    try {
      const query = cuisine ? `${cuisine} restaurants` : 'best restaurants';
      const response = await fetch(`${this.googleMapsApiBase}?engine=google_local&q=${query}+${encodeURIComponent(destination)}&api_key=${this.serpApiKey}`);
      const data = await response.json();
      
      return (data.local_results || []).slice(0, 20).map((restaurant: any) => ({
        id: restaurant.place_id || restaurant.data_id,
        name: restaurant.title || restaurant.name,
        cuisine: restaurant.type || cuisine || 'Local',
        rating: restaurant.rating || 4.0,
        priceRange: this.estimateRestaurantPrice(budgetRange),
        photos: [],
        address: restaurant.address,
        coordinates: {
          lat: restaurant.gps_coordinates?.latitude || 0,
          lng: restaurant.gps_coordinates?.longitude || 0
        },
        placeId: restaurant.place_id || restaurant.data_id
      }));
    } catch (error) {
      console.error('Restaurants API error:', error);
      return [];
    }
  }

  async getActivities(destination: string, budgetRange: string = 'mid', interests?: string[]) {
    try {
      const interestQuery = interests && interests.length > 0 
        ? `${interests.join(' ')} activities attractions` 
        : 'tourist attractions activities';
      
      const response = await fetch(`${this.googleMapsApiBase}?engine=google_local&q=${interestQuery}+${encodeURIComponent(destination)}&api_key=${this.serpApiKey}`);
      const data = await response.json();
      
      return (data.local_results || []).slice(0, 20).map((activity: any) => ({
        id: activity.place_id || activity.data_id,
        name: activity.title || activity.name,
        description: activity.snippet || 'Popular attraction',
        category: this.categorizeActivity(activity.type || activity.title),
        rating: activity.rating || 4.0,
        price: this.estimateActivityPrice(budgetRange),
        duration: '2-3 hours',
        photos: [],
        coordinates: {
          lat: activity.gps_coordinates?.latitude || 0,
          lng: activity.gps_coordinates?.longitude || 0
        },
        placeId: activity.place_id || activity.data_id
      }));
    } catch (error) {
      console.error('Activities API error:', error);
      return [];
    }
  }

  private estimateHotelPrice(budgetRange: string): number {
    switch (budgetRange) {
      case 'low': return 80;
      case 'mid': return 150;
      case 'high': return 300;
      default: return 150;
    }
  }

  private estimateRestaurantPrice(budgetRange: string): string {
    switch (budgetRange) {
      case 'low': return '$';
      case 'mid': return '$$';
      case 'high': return '$$$';
      default: return '$$';
    }
  }

  private estimateActivityPrice(budgetRange: string): number {
    switch (budgetRange) {
      case 'low': return 15;
      case 'mid': return 35;
      case 'high': return 75;
      default: return 35;
    }
  }

  private categorizeActivity(type: string): string {
    if (type?.toLowerCase().includes('museum')) return 'Culture';
    if (type?.toLowerCase().includes('park')) return 'Nature';
    if (type?.toLowerCase().includes('restaurant')) return 'Food';
    return 'Attraction';
  }
}
