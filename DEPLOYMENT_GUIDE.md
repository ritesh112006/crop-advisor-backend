# Deploy Crop Advisor to Render Cloud

Complete step-by-step guide to deploy both backend and frontend to Render.

## Architecture

```
┌─────────────────────────────────────────┐
│         Render Static Site              │
│    (React Frontend - dist/)             │
│  https://crop-advisor.onrender.com      │
└──────────────┬──────────────────────────┘
               │ API calls to
               ▼
┌─────────────────────────────────────────┐
│       Render Web Service                │
│     (Flask Backend)                     │
│ https://crop-advisor-api.onrender.com   │
└─────────────────────────────────────────┘
```

## Prerequisites

- GitHub account (to connect your repo)
- Render account (free tier available) → https://render.com
- OpenWeather API key → https://openweathermap.org/api

## Step 1: Prepare Backend for Deployment

### 1.1 Update Flask App for Production

Your backend already has a `render.yaml` file configured. The key settings are:
- **Runtime**: Python 3.11
- **Start Command**: `gunicorn --bind 0.0.0.0:$PORT app:app`
- **Required Environment Variable**: `OPENWEATHER_API_KEY`

### 1.2 Update Backend App Code

Make sure your `backend/app.py` can read environment variables properly:

```python
import os
from dotenv import load_dotenv

load_dotenv()
OPENWEATHER_API_KEY = os.environ.get("OPENWEATHER_API_KEY", "fallback_key_here")
```

## Step 2: Deploy Backend to Render

### 2.1 Push Code to GitHub

```bash
cd path/to/Crop Advisor 2
git init
git add .
git commit -m "Initial commit: Crop Advisor app"
git branch -M main
git remote add origin https://github.com/ritesh112006/crop-advisor.git
git push -u origin main
```

### 2.2 Create Web Service on Render

1. Go to https://render.com and sign up
2. Click **"New +"** button
3. Select **"Web Service"**
4. Connect your GitHub repo (`crop-advisor`)
5. Fill in deployment details:
   - **Name**: `crop-advisor-backend`
   - **Environment**: `Python`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && gunicorn --bind 0.0.0.0:$PORT app:app`
   - **Region**: Choose closest to you

### 2.3 Add Environment Variables

In the Render dashboard for your Web Service:
- Click **"Environment"**
- Add:
  - **Key**: `OPENWEATHER_API_KEY`
  - **Value**: `3674438b387e43d455aa09366751ac66` (your API key)

### 2.4 Deploy

Click **"Create Web Service"**. Render will automatically build and deploy.

**Note your backend URL** (e.g., `https://crop-advisor-backend.onrender.com`)

## Step 3: Build & Deploy Frontend

### 3.1 Build Frontend Locally

```bash
cd frontend/cropadvisor10423-main
npm install
npm run build
```

This creates a `dist/` folder with optimized static files.

### 3.2 Create Static Site on Render

1. In Render dashboard, click **"New +"**
2. Select **"Static Site"**
3. Connect your GitHub repo
4. Fill in:
   - **Name**: `crop-advisor-frontend`
   - **Build Command**: 
     ```
     cd frontend/cropadvisor10423-main && npm install && npm run build
     ```
   - **Publish Directory**: `frontend/cropadvisor10423-main/dist`

### 3.3 Add Frontend Environment Variables

Before deploying, you need to set `VITE_API_URL` to point to your backend:

**Option A: In Render Dashboard**
- Click **"Environment"** for the static site
- Add:
  - **Key**: `VITE_API_URL`
  - **Value**: `https://crop-advisor-backend.onrender.com` (use your actual backend URL)

**Option B: Create a `.env.production` file locally**
```bash
cd frontend/cropadvisor10423-main
echo "VITE_API_URL=https://crop-advisor-backend.onrender.com" > .env.production
git add .env.production
git commit -m "Add production environment"
git push
```

### 3.4 Deploy Frontend

Click **"Create Static Site"** and Render will automatically build and deploy.

**Note your frontend URL** (e.g., `https://crop-advisor-frontend.onrender.com`)

## Step 4: Test Your Live App

1. Open your frontend URL in a browser: `https://crop-advisor-frontend.onrender.com`
2. Navigate to Dashboard
3. Verify weather data is loading from the backend
4. Check browser console for any errors

## Troubleshooting

### Frontend shows "Unable to load weather"
- Check that `VITE_API_URL` is set correctly in Render
- Verify backend is running (check Render dashboard)
- Check CORS is enabled in backend (`CORS(app)` in app.py)

### Backend showing errors
- Check Render logs in dashboard
- Verify `OPENWEATHER_API_KEY` is set correctly
- Ensure all dependencies in `requirements.txt` are listed

### 502 Bad Gateway Error
- Backend service crashed or not running
- Check Render logs for Python errors
- Verify `gunicorn` is installed in `requirements.txt`

## Environment Variables Summary

| Variable | Service | Value | Example |
|----------|---------|-------|---------|
| `OPENWEATHER_API_KEY` | Backend | Your OpenWeather API key | `3674438b387e43d455aa09366751ac66` |
| `VITE_API_URL` | Frontend | Backend URL | `https://crop-advisor-backend.onrender.com` |

## Next Steps (Optional)

- Add PostgreSQL database on Render for data persistence
- Set up custom domain (e.g., mycropadvisor.com)
- Configure monitoring and alerts
- Add GitHub Actions for CI/CD

## Support

For Render-specific issues, visit: https://render.com/docs
For Flask/Python issues: https://flask.palletsprojects.com/
For React/Vite issues: https://vitejs.dev/
