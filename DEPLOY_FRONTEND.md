# Deploy UNIP Frontend to Render

Complete guide for deploying the UNIP frontend application separately on Render.

## 📋 Prerequisites

- GitHub account
- Render account (https://render.com)
- Frontend code pushed to GitHub repository
- **Backend already deployed** with URL ready

## 🚀 Deployment Steps

### Step 1: Prepare Frontend for Deployment

1. **Verify required files exist:**
   ```bash
   cd frontend
   ls package.json      # Dependencies
   ls vite.config.js    # Vite config
   ls .env.example      # Environment template
   ```

2. **Test production build locally:**
   ```bash
   npm install
   npm run build
   npm run preview
   ```
   - Should create `dist/` folder
   - Preview should work at http://localhost:4173

3. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare frontend for deployment"
   git push origin master
   ```

### Step 2: Create Static Site on Render

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Click **"New +"** → **"Static Site"**

2. **Connect GitHub Repository**
   - Click "Connect GitHub" (if not already connected)
   - Select your UNIP repository
   - Click "Connect"

### Step 3: Configure Static Site

Fill in the following settings:

**Basic Settings:**
- **Name:** `unip-frontend` (or your preferred name)
- **Branch:** `master`
- **Root Directory:** `frontend`

**Build Settings:**
- **Build Command:**
  ```bash
  npm install && npm run build
  ```
- **Publish Directory:**
  ```bash
  dist
  ```

**Important:** Make sure the publish directory is exactly `dist` (where Vite outputs the build)

### Step 4: Configure Environment Variables

Click **"Advanced"** and add these environment variables:

#### Required Variables

**CRITICAL:** Replace `your-backend-name` with your actual backend service name from backend deployment

```env
NODE_VERSION=18.17.0
VITE_API_URL=https://your-backend-name.onrender.com
VITE_APP_NAME=UNIP
VITE_APP_VERSION=1.0.0
```

**Example:**
```env
VITE_API_URL=https://unip-backend-abc123.onrender.com
```

#### Optional Variables

```env
VITE_ENABLE_DEV_TOOLS=false
VITE_LOG_SENSITIVE_DATA=false
```

### Step 5: Configure Redirects/Rewrites

This is **CRITICAL** for React Router to work properly:

1. Scroll down to **"Redirects/Rewrites"** section
2. Click **"Add Rule"**
3. Configure:
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** `Rewrite`

This ensures all routes (like `/analyze`, `/api-docs`) are handled by React Router.

### Step 6: Configure Custom Headers (Security)

Add these security headers:

1. Scroll to **"Headers"** section
2. Add the following headers:

**Header 1:**
- **Path:** `/*`
- **Name:** `X-Frame-Options`
- **Value:** `DENY`

**Header 2:**
- **Path:** `/*`
- **Name:** `X-Content-Type-Options`
- **Value:** `nosniff`

**Header 3:**
- **Path:** `/*`
- **Name:** `X-XSS-Protection`
- **Value:** `1; mode=block`

**Header 4:**
- **Path:** `/*`
- **Name:** `Referrer-Policy`
- **Value:** `strict-origin-when-cross-origin`

### Step 7: Deploy

1. Click **"Create Static Site"**
2. Render will start building your site
3. **Wait for build to complete** (2-3 minutes)
   - Installs npm packages
   - Builds with Vite
   - Deploys to CDN

### Step 8: Verify Deployment

1. **Get your frontend URL:**
   - Format: `https://unip-frontend-xxxx.onrender.com`
   - Click the URL to open your site

2. **Test home page:**
   - Should load UNIP dashboard
   - Check navigation works
   - Verify styling is correct

3. **Test routing:**
   - Navigate to `/analyze`
   - Navigate to `/api-docs`
   - All routes should work (not 404)

4. **Test API connection:**
   - Go to Analyze page
   - Try analyzing text
   - Check browser console for errors

## ⚙️ Post-Deployment Configuration

### Update Backend CORS Settings

**CRITICAL STEP** - Your frontend won't work without this!

1. Go to your **backend service** on Render
2. Click **"Environment"** tab
3. Find `CORS_ORIGINS` variable
4. Update with your frontend URL:
   ```env
   CORS_ORIGINS=https://unip-frontend-xxxx.onrender.com
   ```
   Replace `xxxx` with your actual subdomain

5. Click **"Save Changes"**
6. Backend will automatically redeploy (takes 1-2 minutes)

### Test Full Integration

1. **Open frontend in browser:**
   ```
   https://your-frontend-url.onrender.com
   ```

2. **Open browser console** (F12 → Console tab)

3. **Navigate to Analyze page**

4. **Test text analysis:**
   - Enter some text (e.g., "This is a great product!")
   - Select analysis tasks (sentiment, keywords)
   - Click "Analyze"
   - Should see results without errors

5. **Test file upload:**
   - Create a simple `.txt` file with text
   - Upload and analyze
   - Should process successfully

6. **Check for errors:**
   - Look for CORS errors (if yes, check backend CORS settings)
   - Look for network errors (if yes, check `VITE_API_URL`)
   - Look for 404 errors (if yes, check rewrite rules)

### Custom Domain (Optional)

1. Go to **"Settings"** tab
2. Scroll to **"Custom Domains"**
3. Click **"Add Custom Domain"**
4. Enter your domain (e.g., `unip.yourdomain.com`)
5. Follow DNS configuration instructions
6. Render provides free SSL certificate

## 📊 Monitoring & Logs

### View Logs

1. Go to your service dashboard
2. Click **"Events"** tab
3. View deployment history
4. Click on any deploy to see build logs

### Check Status

- **Status Badge:** Shows "Live" when active
- **Last Deployed:** Shows last successful deploy
- **Deploy Duration:** Shows how long build took

## ⚠️ Important Notes

### Static Sites on Render

- ✅ **Always active** (no sleep/cold start)
- ✅ **Global CDN** (fast worldwide)
- ✅ **Free SSL** (HTTPS automatic)
- ✅ **Custom domains** supported
- ✅ **Auto-deploy** on git push

### Environment Variables

**IMPORTANT:** All Vite env vars must start with `VITE_`

- ✅ `VITE_API_URL` - Works
- ❌ `API_URL` - Won't work (not accessible in app)

### Build Output

Vite builds to `dist/` folder:
```
dist/
├── index.html
├── assets/
│   ├── index-abc123.js
│   ├── index-xyz789.css
│   └── ...
└── ...
```

## 🐛 Troubleshooting

### Build Fails

**Error:** "Build failed with exit code 1"

**Check:**
1. View build logs for specific error
2. Common issues:
   - Missing dependencies in `package.json`
   - Environment variable not set
   - Build command incorrect

**Solution:**
```bash
# Test build locally
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

### White Screen / Blank Page

**Causes:**
1. Wrong publish directory
2. JavaScript errors
3. Missing environment variables

**Debug:**
1. Open browser console (F12)
2. Look for errors
3. Check Network tab for failed requests

**Solutions:**
- Verify publish directory is `dist`
- Check `VITE_API_URL` is set correctly
- Check browser console for specific errors

### Routing Issues (404 on Refresh)

**Symptom:** `/analyze` works when navigating, but 404 when refreshing

**Cause:** Missing rewrite rule

**Solution:**
1. Go to service settings
2. Add rewrite rule: `/*` → `/index.html`
3. Redeploy

### API Connection Fails

**Error in console:** "CORS policy" or "Network error"

**Causes:**
1. Wrong `VITE_API_URL`
2. Backend CORS not configured
3. Backend is sleeping (first request)

**Solutions:**

1. **Check VITE_API_URL:**
   - Open browser console
   - Type: `import.meta.env.VITE_API_URL`
   - Should show backend URL
   - If undefined, check environment variables

2. **Check backend CORS:**
   - Go to backend service settings
   - Verify `CORS_ORIGINS` includes frontend URL
   - Should be full URL with https://

3. **Wake backend:**
   - Visit backend health: `https://backend.onrender.com/api/v1/health`
   - Wait 30 seconds for wake up
   - Try frontend again

### Styles Not Loading

**Symptoms:** Plain HTML, no colors/formatting

**Causes:**
1. CSS files not in build output
2. Wrong base path
3. Build error

**Solutions:**
1. Check `dist/assets/` folder has CSS files
2. Verify `vite.config.js` is correct
3. Rebuild and redeploy

## 🔄 Updating Your Frontend

### Automatic Deploys (Recommended)

Render auto-deploys on push to `master`:

```bash
# Make changes to your frontend
cd frontend
# ... edit files ...
git add .
git commit -m "Update frontend UI"
git push origin master
# Render automatically builds and deploys
```

### Manual Deploy

1. Go to service dashboard
2. Click **"Manual Deploy"**
3. Select branch: `master`
4. Click **"Clear build cache & deploy"** if needed
5. Click **"Deploy"**

### Rollback

1. Go to **"Events"** tab
2. Find previous successful deployment
3. Click **"Rollback to this version"**

## 🔒 Security Checklist

Before going production, verify:

- ✅ Security headers configured
- ✅ `VITE_ENABLE_DEV_TOOLS=false`
- ✅ `VITE_LOG_SENSITIVE_DATA=false`
- ✅ HTTPS enabled (automatic on Render)
- ✅ Backend CORS properly configured
- ✅ No sensitive data in frontend code
- ✅ Environment variables set correctly

## 📈 Performance Tips

### Optimize Bundle Size

1. **Analyze bundle:**
   ```bash
   npm run build -- --mode analyze
   ```

2. **Common optimizations:**
   - Lazy load routes
   - Remove unused dependencies
   - Optimize images

### CDN Benefits

Render's CDN provides:
- ✅ Fast global delivery
- ✅ Automatic caching
- ✅ DDoS protection
- ✅ Free SSL

### Cache Busting

Vite automatically:
- Adds hashes to filenames
- Handles cache invalidation
- No manual cache clearing needed

## 🔗 Final Integration Test

Complete checklist:

1. ✅ Frontend loads at your URL
2. ✅ All routes work (home, analyze, api-docs)
3. ✅ Backend connection works
4. ✅ Text analysis returns results
5. ✅ File upload works
6. ✅ No console errors
7. ✅ Mobile responsive (test on phone)
8. ✅ Fast load times

## 📞 Support Resources

- **Render Docs:** https://render.com/docs/static-sites
- **Vite Docs:** https://vitejs.dev/guide/static-deploy.html
- **React Router:** https://reactrouter.com/en/main
- **Your Logs:** Check Render dashboard events tab

## 📝 Save These URLs

Write down your URLs for future reference:

- **Frontend URL:** `https://_____________________.onrender.com`
- **Backend URL:** `https://_____________________.onrender.com`
- **API Docs:** `https://backend-url/docs`

---

**🎉 Congratulations!** Your UNIP frontend is now live on Render!

## ✨ Post-Launch Checklist

- ✅ Test all features work
- ✅ Backend CORS configured correctly
- ✅ Share your URL!
- ✅ Monitor for errors in first 24 hours
- ✅ Set up analytics (optional)
- ✅ Add custom domain (optional)

**Your UNIP platform is now live and ready to analyze text!**
