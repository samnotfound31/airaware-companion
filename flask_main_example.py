"""
Flask Backend for AQI Assistant
Copy this code into your main.py file
"""

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
import os
from datetime import datetime

app = Flask(__name__)

# CORS Configuration
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:8080", "http://127.0.0.1:8080"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# API Keys - Replace with your actual keys or use environment variables
AQICN_API_KEY = os.getenv('AQICN_API_KEY', '867114a27d5a47b7db3f317c5bf33aaf023519eb')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyDIDi**DLuGpXN6RXvyM')

# ============= HTML Routes =============

@app.route('/')
@app.route('/auth')
def auth():
    return render_template('auth.html')

@app.route('/onboarding')
def onboarding():
    return render_template('onboarding.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

# ============= Authentication API Routes =============

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        
        # TODO: Implement actual user creation in your database
        # For now, return a mock response
        
        return jsonify({
            'success': True,
            'message': 'User created successfully',
            'user': {
                'id': '123',
                'email': email,
                'name': name
            },
            'token': 'mock_jwt_token_here'
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        # TODO: Implement actual authentication
        # Verify credentials against your database
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': {
                'id': '123',
                'email': email,
                'name': 'Test User'
            },
            'token': 'mock_jwt_token_here'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 401

# ============= AQI API Routes =============

@app.route('/api/aqi', methods=['GET'])
def get_aqi():
    try:
        # Get parameters from query string
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        city = request.args.get('city')
        
        if city:
            # Fetch by city name
            url = f'https://api.waqi.info/feed/{city}/?token={AQICN_API_KEY}'
        elif lat and lon:
            # Fetch by coordinates
            url = f'https://api.waqi.info/feed/geo:{lat};{lon}/?token={AQICN_API_KEY}'
        else:
            return jsonify({'error': 'Missing required parameters'}), 400
        
        response = requests.get(url, timeout=10)
        data = response.json()
        
        if data.get('status') == 'ok':
            aqi_data = data['data']
            
            # Transform to frontend format
            result = {
                'aqi': aqi_data.get('aqi'),
                'city': aqi_data['city'].get('name'),
                'station': aqi_data['city'].get('name'),
                'time': aqi_data['time'].get('iso'),
                'dominentpol': aqi_data.get('dominentpol'),
                'iaqi': aqi_data.get('iaqi', {}),
                'forecast': aqi_data.get('forecast', {})
            }
            
            return jsonify(result), 200
        else:
            return jsonify({'error': 'Failed to fetch AQI data'}), 500
            
    except requests.Timeout:
        return jsonify({'error': 'Request timeout'}), 408
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============= Weather API Routes =============

@app.route('/api/weather', methods=['GET'])
def get_weather():
    try:
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        
        if not lat or not lon:
            return jsonify({'error': 'Missing coordinates'}), 400
        
        # Open-Meteo API for current weather
        url = f'https://api.open-meteo.com/v1/forecast'
        params = {
            'latitude': lat,
            'longitude': lon,
            'current': 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
            'timezone': 'auto'
        }
        
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        
        if 'current' in data:
            current = data['current']
            result = {
                'temperature': current.get('temperature_2m'),
                'humidity': current.get('relative_humidity_2m'),
                'windSpeed': current.get('wind_speed_10m'),
                'weatherCode': current.get('weather_code'),
                'time': current.get('time')
            }
            return jsonify(result), 200
        else:
            return jsonify({'error': 'Failed to fetch weather data'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============= Forecast API Routes =============

@app.route('/api/forecast', methods=['GET'])
def get_forecast():
    try:
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        
        if not lat or not lon:
            return jsonify({'error': 'Missing coordinates'}), 400
        
        # Open-Meteo API for forecast
        url = f'https://api.open-meteo.com/v1/forecast'
        params = {
            'latitude': lat,
            'longitude': lon,
            'hourly': 'temperature_2m,weather_code',
            'daily': 'temperature_2m_max,temperature_2m_min,weather_code',
            'timezone': 'auto',
            'forecast_days': 7
        }
        
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        
        return jsonify(data), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============= Location API Routes =============

@app.route('/api/location', methods=['GET'])
def get_location():
    try:
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        
        if not lat or not lon:
            return jsonify({'error': 'Missing coordinates'}), 400
        
        # Open-Meteo Geocoding API for reverse geocoding
        url = f'https://geocoding-api.open-meteo.com/v1/search'
        params = {
            'name': f'{lat},{lon}',
            'count': 1,
            'language': 'en',
            'format': 'json'
        }
        
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        
        if 'results' in data and len(data['results']) > 0:
            location = data['results'][0]
            result = {
                'name': location.get('name'),
                'country': location.get('country'),
                'latitude': location.get('latitude'),
                'longitude': location.get('longitude')
            }
            return jsonify(result), 200
        else:
            return jsonify({'error': 'Location not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============= AI Advice API Routes =============

@app.route('/api/ai/advice', methods=['POST'])
def get_ai_advice():
    try:
        data = request.json
        
        # Extract context from request
        aqi = data.get('aqi')
        weather = data.get('weather', {})
        user_profile = data.get('userProfile', {})
        
        # Prepare prompt for Gemini
        prompt = f"""
        Given the following air quality and weather conditions, provide personalized health advice:
        
        Air Quality Index (AQI): {aqi}
        Temperature: {weather.get('temperature')}°C
        Humidity: {weather.get('humidity')}%
        Wind Speed: {weather.get('windSpeed')} km/h
        
        User Profile:
        - Age: {user_profile.get('age')}
        - Health Sensitivity: {user_profile.get('sensitivity')}
        
        Provide:
        1. A brief assessment of current conditions
        2. Specific health recommendations
        3. Activity suggestions
        
        Keep the response concise and actionable (2-3 paragraphs).
        """
        
        # Call Gemini API
        gemini_url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}'
        gemini_payload = {
            'contents': [{
                'parts': [{'text': prompt}]
            }]
        }
        
        response = requests.post(gemini_url, json=gemini_payload, timeout=30)
        gemini_data = response.json()
        
        if 'candidates' in gemini_data:
            advice_text = gemini_data['candidates'][0]['content']['parts'][0]['text']
            return jsonify({
                'advice': advice_text,
                'timestamp': datetime.utcnow().isoformat()
            }), 200
        else:
            return jsonify({'error': 'Failed to generate advice'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============= Error Handlers =============

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error'}), 500

# ============= Run the app =============

if __name__ == '__main__':
    # Development server
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
