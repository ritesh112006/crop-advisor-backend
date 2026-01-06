# 🚀 Render Deployment - Quick Actions

## ✅ Code Status
- **Git Commit:** `c7b65544` - Production deploy: Chat history persistence, static sensors, multi-language support
- **GitHub Repo:** https://github.com/ritesh112006/crop-advisor-backend
- **Branch:** main
- **Status:** ✅ Pushed and ready to deploy

---

## 📋 Deployment Checklist

### Code Changes Deployed
- ✅ Chat history persistence (backend/app.py + db.py)
- ✅ Static sensor values: pH 6.5, Moisture 68% (backend/db.py lines 236-237)
- ✅ Multi-language support: 7 languages (backend/gemini_ai.py)
- ✅ Max output tokens: 4096 (backend/gemini_ai.py)
- ✅ ESP32 firmware: Static sensor values (backend/esp32_sensor_code.ino)
- ✅ Removed Gemini branding (frontend/src/pages/Chatbot.tsx)
- ✅ Fixed API paths (frontend/src/lib/api.ts)

---

## 🎯 Next Steps for Render Deployment

### **OPTION 1: Auto-Deploy (If Render is connected to GitHub)**
If your Render service is already connected to GitHub:
1. Go to https://dashboard.render.com/
2. Select your service: `crop-advisor-backend`
3. **Wait** - Auto-deployment will trigger automatically (or manually click "Deploy")
4. Watch logs to confirm successful deployment

### **OPTION 2: Manual Deploy**
1. Go to https://dashboard.render.com/
2. Find your service in the list
3. Click on the service
4. Click **"Deploy"** button (top right)
5. Select branch: `main`
6. Click **"Deploy"** again
7. Watch the logs for: `Service is live ✓`

### **OPTION 3: Create New Service**
If you don't have an existing service:
1. Go to https://dashboard.render.com/
2. Click **"New +"**
3. Select **"Web Service"**
4. Connect to: `crop-advisor-backend` repository
5. Configure:
   - **Name:** crop-advisor-backend
   - **Region:** Oregon
   - **Branch:** main
   - **Runtime:** Python 3.11
   - **Build:** `pip install -r requirements.txt`
   - **Start:** `gunicorn --bind 0.0.0.0:$PORT app:app`
6. Click **"Create Web Service"**

---

## ⚙️ Environment Variables (Set in Render Dashboard)

Go to: **Service Settings → Environment**

```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
GEMINI_API_KEY=AIzaSyCmSEPEIdtKgzBDB2tWKcsGLREbmijoEGo
JWT_SECRET=your-super-secret-key-here
OPENWEATHER_API_KEY=3674438b387e43d455aa09366751ac66
```

**⚠️ Important:** 
- Get your actual `DATABASE_URL` from Render PostgreSQL service
- Change `JWT_SECRET` to a secure random string for production
- Keep `GEMINI_API_KEY` safe - this is from your Google Cloud project

---

## ✅ Verify Deployment Success

After Render shows "Service is live ✓":

### 1. **Check Backend is Running**
```bash
curl https://crop-advisor-backend-xxxx.onrender.com/health
# Should return 200 OK
```

### 2. **Test Chat History Endpoint**
```bash
curl https://crop-advisor-backend-xxxx.onrender.com/api/chat/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
# Should return chat messages from database
```

### 3. **Test Sensor Endpoint**
```bash
curl https://crop-advisor-backend-xxxx.onrender.com/api/sensor/latest \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
# Should show: pH: 6.5, Moisture: 68.0
```

### 4. **Test AI Recommendation**
```bash
curl https://crop-advisor-backend-xxxx.onrender.com/api/ai/recommendation \
  -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"crop":"wheat","language":"en"}'
# Should return AI recommendation in selected language
```

---

## 🔍 Troubleshooting

### **Service won't start?**
1. Check Render logs: Dashboard → Service → Logs tab
2. Look for Python error messages
3. Verify `requirements.txt` exists in root directory
4. Ensure Procfile is correct: `web: gunicorn backend.app:app`

### **Database connection failed?**
1. Set DATABASE_URL in Environment Variables
2. Verify PostgreSQL service is running in Render
3. Check database credentials are correct
4. Run migrations if needed

### **Logs show "ModuleNotFoundError"?**
1. Check requirements.txt has all dependencies
2. Add missing package to requirements.txt
3. Commit and push to GitHub
4. Redeploy

### **CORS errors in frontend?**
1. Check backend has CORS enabled: `CORS(app)`
2. Verify API_URL in frontend matches deployed backend URL
3. Ensure OPTIONS requests are allowed

---

## 📊 Deployment URLs

Once deployed, your service will be available at:
```
Backend API:     https://crop-advisor-backend-xxxx.onrender.com
API Endpoints:   https://crop-advisor-backend-xxxx.onrender.com/api/...
WebSocket (if):  wss://crop-advisor-backend-xxxx.onrender.com/...
```

Replace `xxxx` with your actual service name.

---

## 🛠️ After Deployment

1. **Update Frontend API URL** (if frontend is separate):
   ```typescript
   // In frontend/src/lib/api.ts
   export const API_URL = "https://crop-advisor-backend-xxxx.onrender.com/api";
   ```

2. **Deploy Frontend** (to Netlify, Vercel, or Render):
   - Push frontend changes
   - Connect to Netlify/Vercel/Render
   - Auto-deploy or manually deploy

3. **Test Full Application**:
   - Go to frontend URL
   - Register new user
   - Login
   - Chat with AI
   - Check sensor data
   - View chat history
   - Change language and test

---

## 📝 Render Free Tier Notes

⚠️ **Free tier has limitations:**
- Services spin down after 15 min of inactivity
- Restart takes 5-10 seconds
- Limited to 0.5GB RAM
- PostgreSQL: 90 days free, then paid
- Good for testing/staging

**For Production:** Upgrade to paid plan or use different provider.

---

## 🎉 You're Ready to Deploy!

**Summary of what's deployed:**
1. ✅ Chat history saves to database and loads on startup
2. ✅ Sensors always show pH: 6.5, Moisture: 68%
3. ✅ AI responses up to 4096 tokens (no truncation)
4. ✅ 7 language support with dropdown selector
5. ✅ Removed "Powered by Gemini AI" text
6. ✅ ESP32 firmware sends static sensor values

---

**Need help? Check the Render logs for detailed error messages!**
