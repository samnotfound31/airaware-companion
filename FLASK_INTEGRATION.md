# Flask Backend Integration Guide

This guide explains how to integrate the TypeScript React frontend with your Flask backend.

## Setup

### 1. Configure the Backend URL

Create a `.env` file in the project root (copy from `.env.example`):

```bash
VITE_API_BASE_URL=http://localhost:5000
```

Update `http://localhost:5000` to your Flask backend URL.

### 2. Flask Backend Requirements

Your Flask backend should implement these endpoints:

#### GET `/api/aqi`
Fetch current AQI data.

**Query Parameters:**
- `lat` (number): Latitude
- `lon` (number): Longitude
OR
- `city` (string): City name

**Response:**
```json
{
  "aqi": 45,
  "pm25": 12.5,
  "pm10": 28.3,
  "o3": 45,
  "no2": 15,
  "so2": 8,
  "co": 0.4,
  "location": "San Francisco, CA",
  "timestamp": "2025-11-26T10:30:00Z",
  "dominantPollutant": "PM2.5"
}
```

#### GET `/api/weather`
Fetch current weather data.

**Query Parameters:**
- `lat` (number): Latitude
- `lon` (number): Longitude

**Response:**
```json
{
  "temp": 72,
  "feelsLike": 68,
  "humidity": 65,
  "windSpeed": 12,
  "description": "Partly cloudy",
  "icon": "☁️",
  "timestamp": "2025-11-26T10:30:00Z"
}
```

#### GET `/api/forecast`
Fetch weather forecast (hourly).

**Query Parameters:**
- `lat` (number): Latitude
- `lon` (number): Longitude

**Response:**
```json
[
  {
    "time": "12:00 PM",
    "temp": 72,
    "icon": "☀️",
    "description": "Sunny"
  },
  {
    "time": "1:00 PM",
    "temp": 74,
    "icon": "☀️",
    "description": "Sunny"
  }
]
```

#### POST `/api/ai/advice`
Get AI-powered advice.

**Request Body:**
```json
{
  "aqi": 45,
  "weather": {
    "temp": 72,
    "humidity": 65,
    "windSpeed": 12
  },
  "userProfile": {
    "age": "adult",
    "sensitivity": "normal",
    "commute": "walk"
  }
}
```

**Response:**
```json
{
  "advice": "Air quality is excellent! Perfect conditions for outdoor activities.",
  "recommendations": [
    "Great day for outdoor exercise",
    "No mask needed",
    "Perfect for commuting by bike"
  ],
  "timestamp": "2025-11-26T10:30:00Z"
}
```

#### GET `/api/location`
Reverse geocoding.

**Query Parameters:**
- `lat` (number): Latitude
- `lon` (number): Longitude

**Response:**
```json
{
  "lat": 37.7749,
  "lon": -122.4194,
  "city": "San Francisco",
  "country": "US"
}
```

## CORS Configuration

Your Flask backend must enable CORS to allow requests from the frontend:

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:8080", "https://your-production-domain.com"])
```

## Example Flask Implementation

```python
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/aqi', methods=['GET'])
def get_aqi():
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)
    city = request.args.get('city', type=str)
    
    # Your logic to fetch AQI data from AQICN API
    # Use the token: 867114a27d5a47b7db3f317c5bf33aaf023519eb
    
    return jsonify({
        "aqi": 45,
        "pm25": 12.5,
        "pm10": 28.3,
        "location": "San Francisco, CA",
        "timestamp": "2025-11-26T10:30:00Z",
        "dominantPollutant": "PM2.5"
    })

@app.route('/api/weather', methods=['GET'])
def get_weather():
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)
    
    # Your logic to fetch weather data from Open-Meteo API
    
    return jsonify({
        "temp": 72,
        "feelsLike": 68,
        "humidity": 65,
        "windSpeed": 12,
        "description": "Partly cloudy",
        "icon": "☁️",
        "timestamp": "2025-11-26T10:30:00Z"
    })

@app.route('/api/forecast', methods=['GET'])
def get_forecast():
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)
    
    # Your logic to fetch forecast data
    
    return jsonify([
        {"time": "12:00 PM", "temp": 72, "icon": "☀️", "description": "Sunny"},
        {"time": "1:00 PM", "temp": 74, "icon": "☀️", "description": "Sunny"}
    ])

@app.route('/api/ai/advice', methods=['POST'])
def get_ai_advice():
    data = request.json
    
    # Your logic to generate AI advice using Gemini
    # Use the token: AIzaSyDIDi**DLuGpXN6RXvyM
    
    return jsonify({
        "advice": "Air quality is excellent!",
        "recommendations": ["Great day for outdoor exercise"],
        "timestamp": "2025-11-26T10:30:00Z"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

## API Client Architecture

The frontend uses these service files:

- **`src/config/api.ts`**: API configuration and endpoints
- **`src/services/apiClient.ts`**: HTTP client with error handling and timeout
- **`src/services/aqiService.ts`**: AQI data fetching
- **`src/services/weatherService.ts`**: Weather data fetching
- **`src/services/aiService.ts`**: AI advice generation
- **`src/services/locationService.ts`**: Location services
- **`src/hooks/useAQIData.ts`**: React Query hooks for data fetching
- **`src/types/api.ts`**: TypeScript type definitions

## Testing

To test the integration:

1. Start your Flask backend: `python app.py`
2. Start the frontend: `npm run dev`
3. Open http://localhost:8080 in your browser
4. Allow location access when prompted
5. The app will automatically fetch data from your Flask backend

## Error Handling

The frontend includes:
- Loading states with skeleton screens
- Error states with retry functionality
- Request timeout handling (10 seconds default)
- Automatic retry on network errors
- Proper error messages for users

## Data Refresh

- **AQI data**: Refetches every 5 minutes
- **Weather data**: Refetches every 10 minutes
- **Forecast data**: Refetches every 30 minutes
- **Location**: Cached indefinitely (doesn't change frequently)
