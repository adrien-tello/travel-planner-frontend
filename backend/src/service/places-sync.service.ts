import { PlaceType } from '@prisma/client';
import { TripadvisorService, NormalizedPlace } from './tripadvisor.service';
import { prisma } from '../conf/database';

export interface PlaceSyncParams {
  destinationId: string;
  latitude: number;
  longitude: number;
  interests?: string[];
  budgetRange?: 'low' | 'mid' | 'high';
  placeTypes?: PlaceType[];
}

export class PlacesSyncService {
  private tripadvisorService: TripadvisorService;

  constructor() {
    this.tripadvisorService = new TripadvisorService();
  }

  async syncPlacesForDestination(params: PlaceSyncParams): Promise<any[]> {
    const {
      destinationId,
      latitude,
      longitude,
      interests = [],
      budgetRange = 'mid',
      placeTypes = [PlaceType.HOTEL, PlaceType.RESTAURANT, PlaceType.ATTRACTION],
    } = params;

    const allPlaces: any[] = [];

    for (const placeType of placeTypes) {
      try {
        const category = this.mapPlaceTypeToCategory(placeType);
        
        const tripadvisorPlaces = await this.tripadvisorService.searchNearby({
          latitude,
          longitude,
          category,
          radius: 15000,
          limit: 50,
        });

        let normalizedPlaces = tripadvisorPlaces.map(place => 
          this.tripadvisorService.normalizePlace(place, placeType)
        );

        if (budgetRange) {
          normalizedPlaces = this.tripadvisorService.filterByBudget(normalizedPlaces, budgetRange);
        }

        if (interests.length > 0) {
          normalizedPlaces = this.tripadvisorService.filterByInterests(normalizedPlaces, interests);
        }

        const syncedPlaces = await this.syncPlacesToDatabase(normalizedPlaces, destinationId);
        allPlaces.push(...syncedPlaces);

        await this.delay(1000);
      } catch (error) {
        console.error(`Error syncing ${placeType} places:`, error);
      }
    }

    return allPlaces;
  }

  private async syncPlacesToDatabase(places: NormalizedPlace[], destinationId: string) {
    const syncedPlaces = [];

    for (const place of places) {
      try {
        const existingPlace = await prisma.place.findFirst({
          where: {
            OR: [
              { externalId: place.externalId, source: 'TRIPADVISOR' },
              {
                AND: [
                  { name: place.name },
                  { latitude: { gte: place.latitude - 0.001, lte: place.latitude + 0.001 } },
                  { longitude: { gte: place.longitude - 0.001, lte: place.longitude + 0.001 } },
                ],
              },
            ],
          },
        });

        if (existingPlace) {
          const updatedPlace = await prisma.place.update({
            where: { id: existingPlace.id },
            data: {
              name: place.name,
              rating: place.rating,
              priceRange: place.priceRange,
              imageUrl: place.imageUrl,
              website: place.website,
              phone: place.phone,
              description: place.description,
              amenities: place.amenities,
              tags: place.tags,
              updatedAt: new Date(),
            },
          });
          syncedPlaces.push(updatedPlace);
        } else {
          const newPlace = await prisma.place.create({
            data: {
              name: place.name,
              type: place.type,
              destinationId,
              address: place.address,
              latitude: place.latitude,
              longitude: place.longitude,
              description: place.description,
              imageUrl: place.imageUrl,
              rating: place.rating,
              priceRange: place.priceRange,
              website: place.website,
              phone: place.phone,
              amenities: place.amenities,
              tags: place.tags,
              externalId: place.externalId,
              source: 'TRIPADVISOR',
            },
          });
          syncedPlaces.push(newPlace);
        }
      } catch (error) {
        console.error(`Error syncing place ${place.name}:`, error);
      }
    }

    return syncedPlaces;
  }

  async getCachedPlaces(destinationId: string, placeTypes?: PlaceType[]) {
    const whereClause: any = { destinationId };
    
    if (placeTypes && placeTypes.length > 0) {
      whereClause.type = { in: placeTypes };
    }

    return await prisma.place.findMany({
      where: whereClause,
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  private mapPlaceTypeToCategory(placeType: PlaceType): 'hotels' | 'restaurants' | 'attractions' | 'geos' {
    switch (placeType) {
      case PlaceType.HOTEL:
        return 'hotels';
      case PlaceType.RESTAURANT:
        return 'restaurants';
      case PlaceType.ATTRACTION:
      case PlaceType.ACTIVITY:
        return 'attractions';
      default:
        return 'attractions';
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}