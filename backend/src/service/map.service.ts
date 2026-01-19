export interface MapLocation {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
}

export interface RouteInfo {
  distance: number;
  duration: number;
  polyline: string;
}

export interface MapBounds {
  northeast: { lat: number; lng: number };
  southwest: { lat: number; lng: number };
}

export class MapService {
  private googleMapsApiKey = process.env.GOOGLE_PLACES_API_KEY;

  async getPlaceCoordinates(placeName: string, city: string): Promise<MapLocation | null> {
    try {
      const query = `${placeName}, ${city}`;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${this.googleMapsApiKey}`
      );

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
          name: placeName,
          address: result.formatted_address,
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting place coordinates:', error);
      return null;
    }
  }

  async getRoute(origin: MapLocation, destination: MapLocation): Promise<RouteInfo | null> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${this.googleMapsApiKey}`
      );

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];

        return {
          distance: leg.distance.value,
          duration: leg.duration.value,
          polyline: route.overview_polyline.points,
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting route:', error);
      return null;
    }
  }

  calculateBounds(locations: MapLocation[]): MapBounds {
    if (locations.length === 0) {
      return {
        northeast: { lat: 0, lng: 0 },
        southwest: { lat: 0, lng: 0 },
      };
    }

    let minLat = locations[0].latitude;
    let maxLat = locations[0].latitude;
    let minLng = locations[0].longitude;
    let maxLng = locations[0].longitude;

    locations.forEach((loc) => {
      minLat = Math.min(minLat, loc.latitude);
      maxLat = Math.max(maxLat, loc.latitude);
      minLng = Math.min(minLng, loc.longitude);
      maxLng = Math.max(maxLng, loc.longitude);
    });

    return {
      northeast: { lat: maxLat, lng: maxLng },
      southwest: { lat: minLat, lng: minLng },
    };
  }

  async getItineraryMapData(places: Array<{ name: string; city: string; type: string }>) {
    const locations: MapLocation[] = [];

    for (const place of places) {
      const location = await this.getPlaceCoordinates(place.name, place.city);
      if (location) {
        locations.push({ ...location, name: place.name });
      }
    }

    const bounds = this.calculateBounds(locations);
    const center = {
      lat: (bounds.northeast.lat + bounds.southwest.lat) / 2,
      lng: (bounds.northeast.lng + bounds.southwest.lng) / 2,
    };

    return {
      locations,
      bounds,
      center,
      apiKey: this.googleMapsApiKey,
    };
  }
}
