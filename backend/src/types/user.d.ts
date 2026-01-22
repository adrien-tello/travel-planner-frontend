export interface User {
  id: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isOnboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  preferences?: UserPreferences;
}