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
  private googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  private mapboxApiKey = process.env.MAPBOX_API_KEY || process.env.MAPBOX_TOKEN;
  private mapboxPublicKey = process.env.MAPBOX_PUBLIC_KEY || process.env.MAPBOX_API_KEY || '';

  async getPlaceCoordinates(placeName: string, city: string): Promise<MapLocation | null> {
    try {
      const name = placeName.trim();
      const c = city.trim();
      const query = `${name}, ${c}`;

      // Use Google Geocoding if available
      if (this.googleMapsApiKey) {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${this.googleMapsApiKey}`;
        const response = await fetch(url);
        const data: any = await response.json();

        if (data && data.results && data.results.length > 0) {
          const result = data.results[0];
          return {
            latitude: result.geometry.location.lat,
            longitude: result.geometry.location.lng,
            name,
            address: result.formatted_address,
          };
        }

        console.warn('Google geocode returned no results for', query, { status: response.status, body: data });
        return null;
      }

      // Fallback to Mapbox forward geocoding
      if (this.mapboxApiKey) {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${this.mapboxApiKey}&limit=1`;
        const response = await fetch(url);
        const data: any = await response.json();

        if (data && data.features && data.features.length > 0) {
          const feature = data.features[0];
          const [lng, lat] = feature.center;
          return {
            latitude: lat,
            longitude: lng,
            name,
            address: feature.place_name,
          };
        }

        console.warn('Mapbox geocode returned no results for', query, { status: response.status, body: data });
        return null;
      }

      console.warn('No geocoding API key configured (GOOGLE_MAPS_API_KEY or MAPBOX_API_KEY).');
      return null;
    } catch (error) {
      console.error('Error getting place coordinates:', error);
      return null;
    }
  }

  async getRoute(origin: MapLocation, destination: MapLocation): Promise<RouteInfo | null> {
    try {
      const key = this.googleMapsApiKey;
      if (!key) {
        console.warn('No Google Maps API key; route lookup requires GOOGLE_MAPS_API_KEY.');
        return null;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${key}`
      );

      const data: any = await response.json();

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
        locations.push({ ...location, name: place.name.trim() });
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
      apiKey: this.mapboxPublicKey || this.googleMapsApiKey || '',
    };
  }
}
