# Flask Deployment Guide

## Building for Flask Integration

This guide explains how to build the React frontend and integrate it with your Flask backend.

## Build Process

1. **Build the production bundle:**
   ```bash
   npm run build
   ```

2. **After build completes, you'll find:**
   - `dist/index.html` - Main HTML file
   - `dist/assets/` - All JS, CSS, and other assets

## Flask Integration Steps

### Step 1: Copy Files to Flask Project

After building, copy the files to your Flask project:

```bash
# Copy the HTML file to Flask templates folder
cp dist/index.html /path/to/flask/templates/

# Copy all assets to Flask static folder
cp -r dist/assets/* /path/to/flask/static/assets/
```

### Step 2: Update Flask Route

Create a route in your Flask app to serve the React app:

```python
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

# All other routes for the SPA
@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')
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
│   └── index.html          # React app entry point
├── static/
│   └── assets/
│       ├── index-[hash].js  # React app bundle
│       ├── index-[hash].css # Styles
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
cp dist/index.html "$FLASK_PATH/templates/"
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

1. **SPA Routing**: Since this is a Single Page Application with client-side routing (React Router), Flask must serve `index.html` for all routes that don't match API endpoints.

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
