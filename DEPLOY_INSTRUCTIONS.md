# Deployment Instructions

## Quick Deploy to Vercel + Render (Free Tier)

### Prerequisites
- GitHub account
- Render account (free)
- Vercel account (free)

---

## Step 1: Push Code to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Create a new GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/ledgercontrol.git
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `ledgercontrol-backend`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **"Create Web Service"**

### Add Environment Variables
After creating, go to **"Environment"** tab and add:
- `JWT_SECRET` = `your_super_secret_jwt_key_here_change_in_production`
- `JWT_EXPIRE` = `7d`
- `PORT` = `5000`
- `NODE_ENV` = `production`

**Wait for deployment to complete** and copy your backend URL (e.g., `https://ledgercontrol-backend.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. In **Environment Variables**, add:
   - `VITE_API_URL` = `https://your-backend.onrender.com` (from Step 2)
6. Click **"Deploy"**

---

## Step 4: Update Frontend API URL

After backend is deployed, update Vercel environment variable:
- `VITE_API_URL` = `https://ledgercontrol-backend.onrender.com` (your actual Render URL)

---

## Step 5: Test Your Deployment

1. Visit your Vercel frontend URL
2. Try logging in with your admin credentials
3. Test adding products, customers, and sales

---

## Important Notes

- Your app uses **Firebase Firestore** for database (already configured with service account)
- The backend connects to Firebase automatically - no extra database setup needed
- Both Render and Vercel have free tiers with some limitations
- Render free tier puts service to sleep after 15 minutes of inactivity (first request takes ~30s to wake up)

---

## Troubleshooting

### CORS Errors
If you get CORS errors, make sure:
- Backend has `NODE_ENV=production` set
- Frontend VITE_API_URL matches exactly

### Firebase Connection Issues
- Ensure `serviceAccountKey.json` is in the backend folder
- Check Firebase project has Firestore enabled

### Build Failures
- Check Node version compatibility (use Node 18+)
- Ensure all dependencies are in package.json