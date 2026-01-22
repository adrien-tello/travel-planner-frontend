export class PexelsService {
  private static readonly API_KEY = process.env.PIXEL_API_KEY;
  private static readonly BASE_URL = 'https://api.pexels.com/v1';

  static async searchImages(query: string, count: number = 1): Promise<string[]> {
    if (!this.API_KEY) {
      console.warn('PIXEL_API_KEY not found, using fallback images');
      return this.getFallbackImages(count);
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
        {
          headers: {
            'Authorization': this.API_KEY
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`);
      }

      const data = await response.json() as { photos?: Array<{ src: { medium: string } }> };
      
      if (data.photos && data.photos.length > 0) {
        return data.photos.map((photo) => photo.src.medium);
      }

      return this.getFallbackImages(count);
    } catch (error) {
      console.error('Pexels API error:', error);
      return this.getFallbackImages(count);
    }
  }

  static async getVenueImage(venueName: string, venueType: string, city: string): Promise<string> {
    const queries = [
      `${venueName} ${city}`,
      `${venueType} ${city}`,
      `${venueType} interior`,
      venueType
    ];

    for (const query of queries) {
      const images = await this.searchImages(query, 1);
      if (images.length > 0) {
        return images[0];
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return this.getFallbackImageByType(venueType);
  }

  private static getFallbackImages(count: number): string[] {
    const fallbackImages = [
      'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=400'
    ];

    return fallbackImages.slice(0, count);
  }

  private static getFallbackImageByType(venueType: string): string {
    const typeImages: { [key: string]: string } = {
      'HOTEL': 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400',
      'RESTAURANT': 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
      'ATTRACTION': 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=400',
      'museum': 'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400',
      'restaurant': 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=400',
      'hotel': 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400'
    };

    return typeImages[venueType] || typeImages['ATTRACTION'];
  }
}