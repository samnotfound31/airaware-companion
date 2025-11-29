# Complete Setup Guide - Flask + React Frontend

## Prerequisites

- Python 3.8+ installed
- Node.js 16+ and npm installed
- Git (optional)

---

## Part 1: Flask Backend Setup

### Step 1: Create Flask Project Structure

```bash
# Create your Flask project directory
mkdir aqi-assistant-backend
cd aqi-assistant-backend

# Create necessary folders
mkdir templates
mkdir static
mkdir static/assets
```

### Step 2: Create Requirements File

Create `requirements.txt` in your Flask project root:

```txt
Flask==3.0.0
flask-cors==4.0.0
requests==2.31.0
python-dotenv==1.0.0
```

### Step 3: Install Flask Dependencies

```bash
# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 4: Add Your Flask Code

Copy the code from `flask_main_example.py` into a file named `main.py` in your Flask project root.

### Step 5: Create Environment Variables (Optional)

Create `.env` file in Flask project root:

```env
AQICN_API_KEY=867114a27d5a47b7db3f317c5bf33aaf023519eb
GEMINI_API_KEY=AIzaSyDIDi**DLuGpXN6RXvyM
FLASK_ENV=development
```

### Step 6: Run Flask Server

```bash
# Make sure virtual environment is activated
# Run the Flask server
python main.py
```

Flask server will start at: `http://localhost:5000`

You should see output like:
```
 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

---

## Part 2: React Frontend Setup & Build

### Step 1: Navigate to React Project

```bash
# Open a NEW terminal window/tab
cd /path/to/your/react-project
```

### Step 2: Install Dependencies (First Time Only)

```bash
npm install
```

### Step 3: Development Mode (Optional)

For development with hot reload:

```bash
# Run React dev server
npm run dev
```

React dev server will start at: `http://localhost:8080`

Now you can:
- Access React app at `http://localhost:8080`
- React will call Flask APIs at `http://localhost:5000`
- Make changes and see them instantly
- CORS is already configured

### Step 4: Build for Production

When ready to integrate with Flask:

```bash
# Build the production bundle
npm run build
```

This creates a `dist/` folder with:
- `dist/auth.html`
- `dist/onboarding.html`
- `dist/dashboard.html`
- `dist/assets/` (all JS, CSS, images)

---

## Part 3: Integration - Copy Files to Flask

### Manual Copy (Simple Method)

After building, copy files to Flask project:

**On Windows:**
```bash
# Copy HTML files
copy dist\*.html \path\to\flask\project\templates\

# Copy assets
xcopy dist\assets \path\to\flask\project\static\assets\ /E /I /Y
```

**On macOS/Linux:**
```bash
# Copy HTML files
cp dist/*.html /path/to/flask/project/templates/

# Copy assets
cp -r dist/assets/* /path/to/flask/project/static/assets/
```

### Automated Script (Recommended)

Create `deploy.sh` in your React project root:

```bash
#!/bin/bash

# Configuration
FLASK_PATH="/path/to/your/flask/project"

echo "Building React app..."
npm run build

echo "Copying files to Flask..."
# Copy HTML files
cp dist/*.html "$FLASK_PATH/templates/"

# Clear old assets and copy new ones
rm -rf "$FLASK_PATH/static/assets"
mkdir -p "$FLASK_PATH/static/assets"
cp -r dist/assets/* "$FLASK_PATH/static/assets/"

echo "✅ Deployment complete!"
echo "Your Flask app is ready at http://localhost:5000"
```

Make it executable and run:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Part 4: Verify Everything Works

### Check Flask File Structure

Your Flask project should look like:

```
aqi-assistant-backend/
├── main.py
├── requirements.txt
├── .env
├── venv/
├── templates/
│   ├── auth.html
│   ├── onboarding.html
│   └── dashboard.html
└── static/
    └── assets/
        ├── auth-[hash].js
        ├── auth-[hash].css
        ├── onboarding-[hash].js
        ├── onboarding-[hash].css
        ├── dashboard-[hash].js
        ├── dashboard-[hash].css
        └── [other assets]
```

### Test the Application

1. **Make sure Flask is running** on port 5000
2. **Open browser** and go to: `http://localhost:5000`
3. You should see the auth page
4. Navigate to: `http://localhost:5000/dashboard`
5. **Check browser console** for any errors
6. **Check Flask terminal** for API request logs

---

## Workflow Summary

### Development Workflow

```bash
# Terminal 1 - Flask Backend
cd aqi-assistant-backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python main.py

# Terminal 2 - React Frontend (with hot reload)
cd aqi-assistant-react
npm run dev
```

- Work on React at `http://localhost:8080`
- Changes appear instantly
- Calls Flask API at `http://localhost:5000`

### Production Build & Deploy

```bash
# In React project
npm run build
./deploy.sh  # or manually copy files

# Access integrated app
# http://localhost:5000
```

---

## Troubleshooting

### CORS Errors

If you see CORS errors in browser console:
- Check Flask CORS configuration includes `http://localhost:8080`
- Restart Flask server after config changes

### 404 on Assets

If CSS/JS files return 404:
- Verify files are in `static/assets/` folder
- Check Flask `static` folder configuration
- Rebuild React app with `npm run build`

### API Timeout Errors

If API requests timeout:
- Check Flask server is running
- Verify API keys are correct in Flask `.env`
- Check external API services are accessible

### React Shows Blank Page

- Open browser DevTools Console
- Look for errors
- Check Network tab for failed requests
- Verify all HTML files were copied to `templates/`

---

## Environment Variables

### React Development (.env in React project)

```env
VITE_API_BASE_URL=http://localhost:5000
```

### React Production Build

```bash
# Set before building
VITE_API_BASE_URL=https://your-domain.com npm run build
```

### Flask (.env in Flask project)

```env
AQICN_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
FLASK_ENV=development
```

---

## Next Steps

1. ✅ Set up Flask backend
2. ✅ Build React frontend
3. ✅ Copy files and test
4. 🔄 Implement user database for auth
5. 🔄 Add JWT token authentication
6. 🔄 Deploy to production server
