# Deployment Checklist

## Before Deployment

### API Keys Required

Get these API keys before starting deployment:

1. Google Gemini API
   - Visit: https://makersuite.google.com/app/apikey
   - Free tier: 60 requests per minute
   
2. OpenWeatherMap API
   - Visit: https://openweathermap.org/api
   - Free tier: 1000 calls per day
   
3. Google Cloud Translation API
   - Visit: https://cloud.google.com/translate
   - Enable API and create credentials

### Optional Fallback Keys

4. OpenAI API (optional)
   - Visit: https://platform.openai.com/api-keys
   
5. DeepSeek API (optional)
   - Visit: https://platform.deepseek.com

## Deployment Steps

### Step 1: Backend on Render

1. Create new Web Service on Render
2. Connect GitHub repository
3. Configure:
   - Root Directory: `backend`
   - Environment: Docker
   - Add all environment variables
4. Deploy
5. Copy deployment URL

### Step 2: Frontend on Vercel

1. Create new Project on Vercel
2. Import GitHub repository
3. Configure:
   - Root Directory: `kisaan-mitra-final-master`
   - Framework: Vite
   - Add VITE_API_BASE_URL environment variable
4. Deploy
5. Copy deployment URL

### Step 3: Update CORS

1. Go back to Render backend settings
2. Update CORS_ALLOWED_ORIGINS with Vercel URL
3. Redeploy backend

### Step 4: Verify

1. Open frontend URL
2. Complete location setup
3. Test all features:
   - Overview page loads data
   - Weather page shows forecast
   - Soil analysis displays
   - Market prices work
   - Chatbot responds

## Environment Variables Summary

### Backend (Render)

Required:
```
GEMINI_API_KEY=
OPENWEATHERMAP_API_KEY=
GOOGLE_TRANSLATE_API_KEY=
PORT=8080
SPRING_PROFILES_ACTIVE=production
```

Optional:
```
GEMINI_SECONDARY_API_KEY=
OPENAI_API_KEY=
DEEPSEEK_API_KEY=
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Frontend (Vercel)

Required:
```
VITE_API_BASE_URL=https://your-backend.onrender.com
```

## Post-Deployment

1. Test all API endpoints
2. Monitor backend logs
3. Check error tracking
4. Verify SSL certificates
5. Test on mobile devices

## Troubleshooting

### Backend Issues

- Build fails: Check Dockerfile syntax
- Health check fails: Verify port 8080
- API errors: Check environment variables
- Slow response: Upgrade Render plan

### Frontend Issues

- Build fails: Check Node version (18+)
- API calls fail: Verify VITE_API_BASE_URL
- CORS errors: Update backend CORS settings
- Blank page: Check browser console

## Monitoring

### What to Monitor

1. Backend uptime (Render dashboard)
2. API response times
3. Error rates
4. API quota usage
5. Frontend deployment status

### Alert Setup

1. Enable Render email notifications
2. Set up Vercel deployment alerts
3. Monitor API quota limits
4. Track error logs

## Maintenance

### Regular Tasks

1. Check API quota usage weekly
2. Review error logs
3. Update dependencies monthly
4. Monitor SSL certificate expiry
5. Test all features after updates

### Scaling

If experiencing high traffic:

1. Upgrade Render plan
2. Enable Vercel Analytics
3. Consider CDN for static assets
4. Implement caching strategy
5. Optimize API calls

## Support

For deployment issues:
- Check DEPLOYMENT.md for detailed steps
- Review service provider documentation
- Check GitHub issues
- Verify all environment variables
