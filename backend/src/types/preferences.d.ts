export interface UserPreferences {
  id: string;
  userId: string;
  travelStyle: string;
  budgetRange: string;
  interests: string[];
  groupSize: number;
  travelWithKids: boolean;
  accommodation?: {
    rating: number;
  };
  planning?: {
    groupSize: number;
    travelWithKids: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PreferenceUpdateRequest {
  travelStyle?: string;
  budgetRange?: string;
  interests?: string[];
  groupSize?: number;
  travelWithKids?: boolean;
}