import { Alert, Platform } from 'react-native';
import Constants from 'expo-constants';

export class NotificationService {
  private isExpoGo = Constants.appOwnership === 'expo';

  async requestPermissions(): Promise<boolean> {
    return true;
  }

  async scheduleItineraryReminder(title: string, body: string, triggerDate: Date) {
    Alert.alert(title, body);
  }

  async sendLocationAlert(message: string) {
    Alert.alert('Location Update', message);
  }

  async sendWeatherAlert(weather: string, location: string) {
    const message = `${weather} in ${location}`;
    Alert.alert('Weather Update', message);
  }

  async cancelAllNotifications() {
    // No-op fallback
  }
}