import { apiClient } from './apiClient';
import { API_CONFIG } from '@/config/api';
import { WeatherData, ForecastData } from '@/types/api';

export const weatherService = {
  /**
   * Fetch current weather data
   * @param lat - Latitude
   * @param lon - Longitude
   */
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    return apiClient.get<WeatherData>(
      `${API_CONFIG.ENDPOINTS.WEATHER}?lat=${lat}&lon=${lon}`
    );
  },

  /**
   * Fetch weather forecast
   * @param lat - Latitude
   * @param lon - Longitude
   */
  async getForecast(lat: number, lon: number): Promise<ForecastData[]> {
    return apiClient.get<ForecastData[]>(
      `${API_CONFIG.ENDPOINTS.FORECAST}?lat=${lat}&lon=${lon}`
    );
  },
};
