# Flask Deployment Guide

## Building for Flask Integration

This guide explains how to build the React frontend (multi-page setup) and integrate it with your Flask backend.

## Build Process

1. **Build the production bundle:**
   ```bash
   npm run build
   ```

2. **After build completes, you'll find:**
   - `dist/auth.html` - Authentication page
   - `dist/onboarding.html` - User onboarding page
   - `dist/dashboard.html` - Main dashboard page
   - `dist/assets/` - All JS, CSS, and other assets (separate per page)

## Flask Integration Steps

### Step 1: Copy Files to Flask Project

After building, copy the files to your Flask project:

```bash
# Copy all HTML files to Flask templates folder
cp dist/*.html /path/to/flask/templates/

# Copy all assets to Flask static folder
cp -r dist/assets/* /path/to/flask/static/assets/
```

### Step 2: Update Flask Routes

Create routes in your Flask app to serve each page:

```python
from flask import Flask, render_template

app = Flask(__name__)

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
```

### Step 3: Configure CORS (if needed)

If your React app makes API calls to Flask endpoints on different ports:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
```

### Step 4: Environment Variables

Create a `.env` file in your project root for development:

```
VITE_API_BASE_URL=http://localhost:5000
```

For production, set the environment variable before building:

```bash
VITE_API_BASE_URL=https://your-api-domain.com npm run build
```

## File Structure

After copying files, your Flask project should look like:

```
flask_project/
├── templates/
│   ├── auth.html           # Authentication page
│   ├── onboarding.html     # Onboarding page
│   └── dashboard.html      # Dashboard page
├── static/
│   └── assets/
│       ├── auth-[hash].js    # Auth page JS
│       ├── auth-[hash].css   # Auth page CSS
│       ├── onboarding-[hash].js
│       ├── onboarding-[hash].css
│       ├── dashboard-[hash].js
│       ├── dashboard-[hash].css
│       └── [other assets]
├── app.py                  # Flask application
└── requirements.txt
```

## Asset Path Configuration

The build is configured with `base: "/static/"` in production, which means all asset references in the HTML will be prefixed with `/static/`.

This matches Flask's default static folder serving pattern.

## Automated Deployment Script

You can create a deployment script `deploy.sh`:

```bash
#!/bin/bash

# Build the React app
npm run build

# Define Flask project path
FLASK_PATH="/path/to/your/flask/project"

# Copy files
cp dist/*.html "$FLASK_PATH/templates/"
rm -rf "$FLASK_PATH/static/assets"
mkdir -p "$FLASK_PATH/static/assets"
cp -r dist/assets/* "$FLASK_PATH/static/assets/"

echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

## Important Notes

1. **Multi-Page Architecture**: This is now a traditional multi-page application where each page has its own HTML, CSS, and JS files. Navigation between pages causes full page reloads.

2. **API Endpoints**: Keep your API routes separate, typically under `/api/*`:
   ```python
   @app.route('/api/aqi/<location>')
   def get_aqi(location):
       # Your API logic
       return jsonify(data)
   ```

3. **Static Files**: Flask will automatically serve files from the `static/` folder at the `/static/` URL prefix.

4. **Rebuilding**: Every time you make changes to the React app, you need to rebuild and copy the files again.

## Development Workflow

For development, it's recommended to:
1. Run the React dev server: `npm run dev` (port 8080)
2. Run Flask backend separately (port 5000)
3. Use the CORS configuration so React can call Flask APIs
4. Only build and deploy to Flask when ready for production testing
