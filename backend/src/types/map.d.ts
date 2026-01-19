export interface MapLocation {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
  placeId?: string;
}

export interface RouteInfo {
  distance: number;
  duration: number;
  polyline: string;
  steps?: RouteStep[];
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  startLocation: { lat: number; lng: number };
  endLocation: { lat: number; lng: number };
}

export interface MapBounds {
  northeast: { lat: number; lng: number };
  southwest: { lat: number; lng: number };
}

export interface ItineraryMapData {
  locations: MapLocation[];
  routes: RouteInfo[];
  bounds: MapBounds;
  center: { lat: number; lng: number };
}

export interface PlaceMarker {
  id: string;
  location: MapLocation;
  type: 'HOTEL' | 'RESTAURANT' | 'ATTRACTION' | 'ACTIVITY';
  title: string;
  description?: string;
  order?: number;
}
