// API Configuration
export const API_CONFIG = {
  // Update this to your Flask backend URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  ENDPOINTS: {
    AQI: '/api/aqi',
    WEATHER: '/api/weather',
    FORECAST: '/api/forecast',
    AI_ADVICE: '/api/ai/advice',
    LOCATION: '/api/location',
  },
  TIMEOUT: 10000, // 10 seconds
};
