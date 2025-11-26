// API Response Types
export interface AQIData {
  aqi: number;
  pm25: number;
  pm10: number;
  o3?: number;
  no2?: number;
  so2?: number;
  co?: number;
  location: string;
  timestamp: string;
  dominantPollutant: string;
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  timestamp: string;
}

export interface ForecastData {
  time: string;
  temp: number;
  icon: string;
  description: string;
}

export interface AIAdviceRequest {
  aqi: number;
  weather: WeatherData;
  userProfile?: {
    age?: string;
    sensitivity?: string;
    commute?: string;
  };
}

export interface AIAdviceResponse {
  advice: string;
  recommendations: string[];
  timestamp: string;
}

export interface LocationData {
  lat: number;
  lon: number;
  city: string;
  country: string;
}
