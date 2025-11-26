import { useQuery } from '@tanstack/react-query';
import { aqiService } from '@/services/aqiService';
import { weatherService } from '@/services/weatherService';
import { locationService } from '@/services/locationService';

export const useAQIData = (lat?: number, lon?: number) => {
  return useQuery({
    queryKey: ['aqi', lat, lon],
    queryFn: async () => {
      if (!lat || !lon) {
        throw new Error('Location coordinates required');
      }
      return aqiService.getCurrentAQI(lat, lon);
    },
    enabled: !!lat && !!lon,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });
};

export const useWeatherData = (lat?: number, lon?: number) => {
  return useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: async () => {
      if (!lat || !lon) {
        throw new Error('Location coordinates required');
      }
      return weatherService.getCurrentWeather(lat, lon);
    },
    enabled: !!lat && !!lon,
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    staleTime: 5 * 60 * 1000,
  });
};

export const useForecastData = (lat?: number, lon?: number) => {
  return useQuery({
    queryKey: ['forecast', lat, lon],
    queryFn: async () => {
      if (!lat || !lon) {
        throw new Error('Location coordinates required');
      }
      return weatherService.getForecast(lat, lon);
    },
    enabled: !!lat && !!lon,
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
    staleTime: 15 * 60 * 1000,
  });
};

export const useLocation = () => {
  return useQuery({
    queryKey: ['location'],
    queryFn: locationService.getCurrentLocation,
    staleTime: Infinity, // Location doesn't change frequently
    retry: 1,
  });
};
