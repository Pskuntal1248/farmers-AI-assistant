# Deployment Guide

## Prerequisites

- Backend: Render.com account
- Frontend: Vercel account
- API Keys:
  - GEMINI_API_KEY (Google Gemini)
  - OPENWEATHERMAP_API_KEY (OpenWeatherMap)
  - GOOGLE_TRANSLATE_API_KEY (Google Cloud Translation)

---

## Backend Deployment (Render)

### 1. Connect Repository

1. Log in to Render.com
2. Click "New" > "Web Service"
3. Connect your GitHub repository
4. Select the repository: `farmers-AI-assistant`

### 2. Configure Service

**Basic Settings:**
- Name: `kishan-mitra-backend`
- Region: Choose closest to your users
- Branch: `master`
- Root Directory: `backend`
- Environment: `Docker`
- Dockerfile Path: `backend/Dockerfile`

**Instance Type:**
- Free tier or Starter ($7/month recommended)

### 3. Environment Variables

Add these environment variables in Render dashboard:

```
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_SECONDARY_API_KEY=your_secondary_gemini_key_here
OPENAI_API_KEY=your_openai_key_here
DEEPSEEK_API_KEY=your_deepseek_key_here
OPENWEATHERMAP_API_KEY=your_openweather_key_here
GOOGLE_TRANSLATE_API_KEY=your_google_translate_key_here
PORT=8080
SPRING_PROFILES_ACTIVE=production
```

### 4. Deploy

- Click "Create Web Service"
- Wait for build to complete (5-10 minutes)
- Note the deployment URL: `https://your-app.onrender.com`

### 5. Verify

Test the API:
```bash
curl https://your-app.onrender.com/api/ping
```

---

## Frontend Deployment (Vercel)

### 1. Connect Repository

1. Log in to Vercel
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Select `farmers-AI-assistant`

### 2. Configure Project

**Build Settings:**
- Framework Preset: `Vite`
- Root Directory: `kisaan-mitra-final-master`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 3. Environment Variables

Add these in Vercel dashboard:

```
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

### 4. Deploy

- Click "Deploy"
- Wait for build to complete (2-5 minutes)
- Note the deployment URL: `https://your-app.vercel.app`

### 5. Update Backend CORS

After deployment, update backend environment variable in Render:

```
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://*.vercel.app
```

Redeploy backend service.

---

## Post-Deployment

### Test Full Integration

1. Open frontend URL
2. Complete location setup
3. Verify data loads on Overview page
4. Test chatbot functionality
5. Check market prices page

### Monitoring

**Backend (Render):**
- View logs in Render dashboard
- Monitor health check status
- Check metrics tab for performance

**Frontend (Vercel):**
- View deployment logs
- Check Analytics tab
- Monitor function invocations

---

## Common Issues

### Backend Not Starting

- Check environment variables are set correctly
- Verify Docker build completed successfully
- Review logs for specific errors
- Ensure port 8080 is not blocked

### Frontend API Connection Failed

- Verify VITE_API_BASE_URL is correct
- Check CORS settings in backend
- Ensure backend is running
- Test API endpoint directly

### Chatbot Not Responding

- Verify Gemini API keys are valid
- Check API quota limits
- Review backend logs for errors
- Ensure all fallback keys are configured

---

## Local Development

### Backend

```bash
cd backend
mvn spring-boot:run
```

Access at: http://localhost:8080

### Frontend

```bash
cd kisaan-mitra-final-master
npm install
npm run dev
```

Access at: http://localhost:3000

---

## Production URLs

After deployment, update these URLs:

- Backend API: `https://your-backend.onrender.com`
- Frontend App: `https://your-app.vercel.app`

---

## Support

For issues or questions:
- Check deployment logs
- Review environment variables
- Verify API keys are active
- Ensure services are running
