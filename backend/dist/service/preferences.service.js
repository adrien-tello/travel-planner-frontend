"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferenceService = void 0;
const database_1 = require("../conf/database");
class PreferenceService {
    async createUserPreferences(userId, preferences) {
        const userPreferences = await database_1.prisma.userPreferences.upsert({
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
    async getUserPreferences(userId) {
        const preferences = await database_1.prisma.userPreferences.findUnique({
            where: { userId },
        });
        if (!preferences) {
            throw new Error("User preferences not found");
        }
        return preferences;
    }
    async updateUserPreferences(userId, data) {
        const updated = await database_1.prisma.userPreferences.update({
            where: { userId },
            data,
        });
        return updated;
    }
    async deleteUserPreference(userId) {
        await database_1.prisma.userPreferences.delete({
            where: { userId },
        });
        return { message: "Preferences deleted successfully" };
    }
}
exports.PreferenceService = PreferenceService;
