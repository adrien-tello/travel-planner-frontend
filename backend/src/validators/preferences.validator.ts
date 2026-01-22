import { UserPreferences, TravelInterest } from '../types/prefrences';

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export function validatePreferences(preferences: UserPreferences): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate travel style
  if (!['relaxed', 'moderate', 'packed'].includes(preferences.travelStyle)) {
    errors.push({
      field: 'travelStyle',
      message: 'Travel style must be relaxed, moderate, or packed',
      value: preferences.travelStyle
    });
  }

  // Validate budget range
  if (!['low', 'mid', 'high'].includes(preferences.budgetRange)) {
    errors.push({
      field: 'budgetRange',
      message: 'Budget range must be low, mid, or high',
      value: preferences.budgetRange
    });
  }

  // Validate interests array
  if (!Array.isArray(preferences.interests) || preferences.interests.length === 0) {
    errors.push({
      field: 'interests',
      message: 'At least one interest must be selected',
      value: preferences.interests
    });
  }

  // Validate accommodation rating
  if (preferences.accommodation?.rating && 
      (preferences.accommodation.rating < 1 || preferences.accommodation.rating > 5)) {
    errors.push({
      field: 'accommodation.rating',
      message: 'Accommodation rating must be between 1 and 5',
      value: preferences.accommodation.rating
    });
  }

  // Validate group size
  if (preferences.planning?.groupSize && preferences.planning.groupSize < 1) {
    errors.push({
      field: 'planning.groupSize',
      message: 'Group size must be at least 1',
      value: preferences.planning.groupSize
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validatePartialPreferences(preferences: Partial<UserPreferences>): ValidationResult {
  const errors: ValidationError[] = [];

  // Only validate fields that are present
  if (preferences.travelStyle && !['relaxed', 'moderate', 'packed'].includes(preferences.travelStyle)) {
    errors.push({
      field: 'travelStyle',
      message: 'Travel style must be relaxed, moderate, or packed',
      value: preferences.travelStyle
    });
  }

  if (preferences.budgetRange && !['low', 'mid', 'high'].includes(preferences.budgetRange)) {
    errors.push({
      field: 'budgetRange',
      message: 'Budget range must be low, mid, or high',
      value: preferences.budgetRange
    });
  }

  if (preferences.interests && (!Array.isArray(preferences.interests) || preferences.interests.length === 0)) {
    errors.push({
      field: 'interests',
      message: 'At least one interest must be selected',
      value: preferences.interests
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}