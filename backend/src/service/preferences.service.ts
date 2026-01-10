import { prisma } from "../conf/database";
import { UserPreferences, OnboardingPreferences } from "../types/prefrences";

export class PreferenceService {
  async createUserPreferences(userId: string, preferences: OnboardingPreferences) {
    const userPreferences = await prisma.userPreferences.upsert({
      where: { userId },
      update: {
        travelStyle: preferences.travelStyle || 'moderate',
        budgetRange: preferences.budgetRange || 'mid',
        interests: preferences.interests || [],
        groupSize: preferences.groupSize || 1,
        travelWithKids: preferences.travelWithKids || false,
      },
      create: {
        userId,
        travelStyle: preferences.travelStyle || 'moderate',
        budgetRange: preferences.budgetRange || 'mid',
        interests: preferences.interests || [],
        groupSize: preferences.groupSize || 1,
        travelWithKids: preferences.travelWithKids || false,
      },
    });

    return userPreferences;
  }

  async getUserPreferences(userId: string) {
    const preferences = await prisma.userPreferences.findUnique({
      where: { userId },
    });

    if (!preferences) {
      throw new Error("User preferences not found");
    }

    return preferences;
  }

  async updateUserPreferences(userId: string, data: Partial<UserPreferences>) {
    const updated = await prisma.userPreferences.update({
      where: { userId },
      data,
    });

    return updated;
  }

  async deleteUserPreference(userId: string) {
    await prisma.userPreferences.delete({
      where: { userId },
    });

    return { message: "Preferences deleted successfully" };
  }
}