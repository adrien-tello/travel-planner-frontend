import { apiClient } from "./client.api";
import { ApiResponse } from "./types";

export interface OnboardingPreferences {
  travelStyle: 'relaxed' | 'moderate' | 'packed';
  budgetRange: 'low' | 'mid' | 'high';
  interests: string[];
  groupSize: number;
  travelWithKids: boolean;
}

export const preferencesApi = {
  // Save onboarding preferences
  savePreferences: async (preferences: OnboardingPreferences): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>(
      "/preferences",
      preferences
    );
    return response.data.data!;
  },

  // Get user preferences
  getPreferences: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>("/preferences");
    return response.data.data!;
  },

  // Update preferences
  updatePreferences: async (preferences: Partial<OnboardingPreferences>): Promise<any> => {
    const response = await apiClient.put<ApiResponse<any>>(
      "/preferences",
      preferences
    );
    return response.data.data!;
  },
};

export default preferencesApi;