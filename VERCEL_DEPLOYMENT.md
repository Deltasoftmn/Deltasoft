# Vercel Deployment Guide for Deltasoft Frontend

## Quick Fix

The project is configured for Vercel deployment. The `vercel.json` file in the root directory tells Vercel how to build your frontend.

## Option 1: Deploy from Root (Current Setup)

The `vercel.json` file is already configured. When deploying:

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Make sure the **Root Directory** is set to the repository root (not `frontend`)
   - The `vercel.json` will handle the build configuration

2. **The build should work automatically** with the current configuration

## Option 2: Deploy Frontend Directory Directly (Recommended)

This is the simpler approach:

1. **In Vercel Dashboard:**
   - Go to Project Settings → General
   - Set **Root Directory** to `frontend`
   - Save settings

2. **Remove or ignore the root `vercel.json`** (Vercel will auto-detect Create React App)

3. **Redeploy** - Vercel will automatically:
   - Detect it's a Create React App
   - Run `npm install`
   - Run `npm run build`
   - Serve from the `build` directory

## Common Issues and Fixes

### Issue: Build Fails with Module Not Found

**Solution:** Make sure all dependencies are in `frontend/package.json`. Run:
```bash
cd frontend
npm install
```

### Issue: Build Succeeds but App Shows Blank Page

**Solution:** This is usually a routing issue. The `vercel.json` includes a rewrite rule to handle React Router. Make sure your `vercel.json` has:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Issue: API Calls Fail (404 errors)

**Solution:** The frontend uses relative API paths (`/api/*`). You need to:
1. Deploy your backend separately (e.g., on Heroku, Railway, or another service)
2. Set up environment variables in Vercel for your API URL
3. Update your frontend to use the environment variable for API calls

**To fix API calls:**
1. In Vercel Dashboard → Settings → Environment Variables
2. Add: `REACT_APP_API_URL` = `https://your-backend-url.com`
3. Update your frontend code to use `process.env.REACT_APP_API_URL` instead of relative paths

### Issue: Node Version Errors

**Solution:** Create a `.nvmrc` file in the `frontend` directory:
```bash
echo "18" > frontend/.nvmrc
```

Or specify in `package.json`:
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## Current Configuration

The root `vercel.json` is configured with:
- **Build Command:** `cd frontend && npm install && npm run build`
- **Output Directory:** `frontend/build`
- **Install Command:** `cd frontend && npm install`
- **Rewrites:** All routes redirect to `/index.html` for React Router

## Next Steps After Deployment

1. **Set up environment variables** for your backend API URL
2. **Configure CORS** on your backend to allow requests from your Vercel domain
3. **Test all routes** to ensure React Router works correctly
4. **Set up a custom domain** (optional) in Vercel project settings

## Backend Deployment

Your backend needs to be deployed separately. Consider:
- **Heroku** - Easy Node.js deployment
- **Railway** - Modern alternative to Heroku
- **Render** - Simple deployment platform
- **DigitalOcean App Platform** - Flexible hosting

After deploying the backend, update your frontend environment variables with the backend URL.
