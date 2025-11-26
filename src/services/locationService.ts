import { apiClient } from './apiClient';
import { API_CONFIG } from '@/config/api';
import { LocationData } from '@/types/api';

export const locationService = {
  /**
   * Get location data from coordinates
   * @param lat - Latitude
   * @param lon - Longitude
   */
  async getLocationData(lat: number, lon: number): Promise<LocationData> {
    return apiClient.get<LocationData>(
      `${API_CONFIG.ENDPOINTS.LOCATION}?lat=${lat}&lon=${lon}`
    );
  },

  /**
   * Get user's current location using browser geolocation
   */
  async getCurrentLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        }
      );
    });
  },
};
