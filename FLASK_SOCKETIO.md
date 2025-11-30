# Flask Socket.IO Integration Guide

## Backend Setup

### 1. Install Dependencies

Add to `requirements.txt`:
```
flask-socketio==5.3.6
python-engineio==4.9.0
python-socketio==5.11.0
```

Install:
```bash
pip install -r requirements.txt
```

### 2. Update Flask Backend

Replace the content in `flask_main_example.py` with the following Socket.IO-enabled version:

```python
"""
Flask Backend with Socket.IO for AQI Assistant
"""

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room
import requests
import os
from datetime import datetime

app = Flask(__name__)

# CORS Configuration
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:8080", "http://127.0.0.1:8080", "http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Socket.IO Configuration
socketio = SocketIO(
    app,
    cors_allowed_origins=["http://localhost:8080", "http://127.0.0.1:8080", "http://localhost:5173"],
    async_mode='threading'
)

# API Keys
AQICN_API_KEY = os.getenv('AQICN_API_KEY', '867114a27d5a47b7db3f317c5bf33aaf023519eb')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyDIDi**DLuGpXN6RXvyM')

# ============= Socket.IO Events =============

@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')
    emit('connected', {'status': 'Connected to AQI Assistant'})

@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected: {request.sid}')

@socketio.on('join')
def handle_join(data):
    user_id = data.get('userId')
    if user_id:
        join_room(user_id)
        print(f'User {user_id} joined room')

@socketio.on('user_message')
def handle_user_message(data):
    """
    Receives user message, calls Gemini API, and emits assistant response
    Expected data: { userId?: string, text: string, meta?: {...} }
    """
    print(f'Received user_message: {data}')
    
    user_id = data.get('userId')
    text = data.get('text', '')
    meta = data.get('meta', {})
    
    if not text:
        emit('assistant_message', {
            'text': 'Please provide a message.',
            'timestamp': datetime.utcnow().isoformat(),
            'from': 'assistant',
            'error': True
        })
        return
    
    try:
        # Prepare prompt for Gemini
        prompt = f"""
        You are an AI assistant specializing in air quality and health advice.
        
        User message: {text}
        
        Provide a helpful, concise response (2-3 sentences). If the message is about 
        air quality, weather, or health, give specific actionable advice.
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
            
            # Emit assistant response to the requesting client
            emit('assistant_message', {
                'text': advice_text,
                'timestamp': datetime.utcnow().isoformat(),
                'from': 'assistant',
                'meta': {
                    'model': 'gemini-pro'
                }
            })
        else:
            emit('assistant_message', {
                'text': 'Sorry, I encountered an error generating a response.',
                'timestamp': datetime.utcnow().isoformat(),
                'from': 'assistant',
                'error': True
            })
            
    except Exception as e:
        print(f'Error in handle_user_message: {e}')
        emit('assistant_message', {
            'text': f'Error: {str(e)}',
            'timestamp': datetime.utcnow().isoformat(),
            'from': 'assistant',
            'error': True
        })

@socketio.on('typing')
def handle_typing(data):
    """Optional: Handle typing indicators"""
    user_id = data.get('userId')
    is_typing = data.get('isTyping', False)
    # Broadcast to other users in room if needed
    emit('user_typing', {'userId': user_id, 'isTyping': is_typing}, broadcast=True, include_self=False)

# ============= HTML Routes (existing) =============

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

# ============= Keep all existing API routes =============
# (Include all the /api/auth/*, /api/aqi, /api/weather, etc. routes from original file)

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    # ... existing code ...
    pass

@app.route('/api/auth/login', methods=['POST'])
def login():
    # ... existing code ...
    pass

# ... (all other existing routes)

# ============= Error Handlers =============

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error'}), 500

# ============= Run the app with Socket.IO =============

if __name__ == '__main__':
    # Use socketio.run() instead of app.run() for Socket.IO support
    socketio.run(
        app,
        host='0.0.0.0',
        port=5000,
        debug=True
    )
```

## Testing Checklist

### 1. Install Dependencies
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

### 2. Start Backend
```bash
python flask_main_example.py
```

You should see: `Socket.IO server started`

### 3. Start Frontend Dev Server
```bash
npm run dev
```

Open http://localhost:5173

### 4. Test Chat Flow

1. Navigate to `/dashboard`
2. Open browser console (F12) to see Socket.IO connection logs
3. Type a message in the chat composer and send
4. Verify:
   - User message appears immediately
   - "Typing" indicator shows while waiting
   - Assistant reply appears within ~10 seconds
   - Messages persist in the chat window

### 5. Test Floating Chat

1. Collapse the chat using the minimize button
2. Send a message from another tab/window (if testing multi-user)
3. Verify unread badge increments
4. Click the floating launcher
5. Verify chat expands and unread count resets

### 6. Test Profile Panel

1. Scroll to profile section on dashboard
2. Verify all placeholder fields are visible:
   - `{{FIRST_NAME}} {{LAST_NAME}}`
   - `{{EMAIL}}`
   - `{{AGE}}`
   - `{{PREFERRED_CITY}}`
3. Verify TODO comments are present for developers

## Environment Variables

Add to `.env` file:

```bash
AQICN_API_KEY=867114a27d5a47b7db3f317c5bf33aaf023519eb
GEMINI_API_KEY=AIzaSyDIDi**DLuGpXN6RXvyM
FLASK_ENV=development
```

## Troubleshooting

### Socket.IO Not Connecting

1. Check CORS origins match your frontend URL
2. Verify `socket.io-client` is installed: `npm list socket.io-client`
3. Check browser console for connection errors
4. Verify Flask-SocketIO is running (not regular Flask server)

### No Assistant Response

1. Verify GEMINI_API_KEY is set correctly
2. Check Flask console for error logs
3. Test Gemini API directly with curl:
   ```bash
   curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY" \
   -H "Content-Type: application/json" \
   -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
   ```

### Build Issues

If `npm run build` fails:
1. Ensure `socket.io-client` is in `package.json`
2. Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

## Next Steps for Developers

### Backend Integration TODO:

1. **Profile API** - Create `/api/profile` endpoint:
   ```python
   @app.route('/api/profile', methods=['GET'])
   def get_profile():
       # TODO: Fetch from database
       return jsonify({
           'firstName': 'John',
           'lastName': 'Doe',
           'email': 'john@example.com',
           'age': 30,
           'sensitivities': 'Seasonal allergies',
           'preferredCity': 'San Francisco'
       })
   ```

2. **Message Persistence** - Store chat history in database
3. **Authentication** - Add JWT validation for Socket.IO connections
4. **Rate Limiting** - Add rate limiting for Gemini API calls

### Frontend Integration TODO:

1. Update `UserProfile.tsx` to fetch from `/api/profile`
2. Add edit functionality for profile fields
3. Store user_id in localStorage after login
4. Add message persistence (fetch history on mount)

## Production Considerations

- Use `async_mode='gevent'` or `eventlet` for better performance
- Add authentication middleware for Socket.IO
- Implement message queuing (Redis) for scaling
- Add proper error handling and retry logic
- Use environment-specific Socket.IO URLs
