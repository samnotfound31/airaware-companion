import { apiClient } from './apiClient';
import { API_CONFIG } from '@/config/api';
import { AQIData } from '@/types/api';

export const aqiService = {
  /**
   * Fetch current AQI data for a location
   * @param lat - Latitude
   * @param lon - Longitude
   */
  async getCurrentAQI(lat: number, lon: number): Promise<AQIData> {
    return apiClient.get<AQIData>(
      `${API_CONFIG.ENDPOINTS.AQI}?lat=${lat}&lon=${lon}`
    );
  },

  /**
   * Fetch AQI data by city name
   * @param city - City name
   */
  async getAQIByCity(city: string): Promise<AQIData> {
    return apiClient.get<AQIData>(
      `${API_CONFIG.ENDPOINTS.AQI}?city=${encodeURIComponent(city)}`
    );
  },
};
