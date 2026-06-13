# QUICK START - Option B Implementation

## 🚀 5-Minute Setup Guide

### What's Included
✅ Sentry error tracking (production-grade monitoring)  
✅ Pre-commit hooks (automatic code validation)  
✅ Production environment config  
✅ GitHub + Vercel integration ready  

### Files Created/Updated
- `frontend/package.json` - Sentry dependency added
- `frontend/src/services/sentry.ts` - Sentry client wrapper
- `frontend/.env.production` - Production environment variables
- `setup-husky.sh` / `setup-husky.ps1` - Pre-commit hook setup scripts
- `OPTION_B_IMPLEMENTATION.md` - Complete documentation

## 🎯 Immediate Actions (Do This Now)

### 1. Install Dependencies
```bash
cd frontend
npm install
```
**Time: 2-3 minutes**

### 2. Create Sentry Account (Free)
1. Visit https://sentry.io
2. Sign up (free tier is sufficient)
3. Create project → Select React
4. Copy your DSN (looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxx`)
5. Paste into `frontend/.env.production` → VITE_SENTRY_DSN

**Time: 1-2 minutes**

### 3. Update frontend/src/main.tsx
Add 2 lines at the very top of your render code:

```typescript
import { initSentry } from "./services/sentry";

// Add this BEFORE any React rendering
initSentry();

// Then your normal render...
ReactDOM.createRoot(document.getElementById("root")!).render(...)
```

**Time: 1 minute**

### 4. Setup Pre-commit Hooks (Windows)
```powershell
cd frontend
..\setup-husky.ps1
```

Or manually:
```bash
npm install husky lint-staged --save-dev
npx husky install
npx husky add .husky/pre-commit "npm run pre-commit"
```

**Time: 1-2 minutes**

### 5. Update package.json Scripts

In `frontend/package.json`, update scripts section:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint src/",
  "type-check": "tsc --noEmit",
  "pre-commit": "lint-staged"
}
```

Add after devDependencies:
```json
"lint-staged": {
  "src/**/*.{ts,tsx}": [
    "eslint --fix",
    "tsc --noEmit"
  ]
}
```

**Time: 2 minutes**

## 🔥 Deploy to GitHub & Vercel (5 minutes)

### GitHub Setup
```bash
# From project root
git add .
git commit -m "feat: add Sentry error tracking and pre-commit hooks"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/advgd-crm.git
git push -u origin main
```

### Vercel Deployment
**Option 1 - Via CLI (Fastest)**
```bash
npm install -g vercel
vercel login
cd frontend
vercel --prod
```

**Option 2 - Via Dashboard**
1. Go to https://vercel.com
2. Import your GitHub repository
3. Set root directory to `frontend`
4. Add environment variables:
   - `VITE_API_URL`: `https://api.advgd-crm.com`
   - `VITE_SENTRY_DSN`: Your Sentry DSN
5. Click Deploy

## ✅ Validation

After deployment, verify:
- [ ] App loads on Vercel domain
- [ ] Can see your site live
- [ ] Open browser console → should see Sentry initialized
- [ ] Check Sentry dashboard → should see performance data

## 📊 Monitoring Your App

### Sentry Dashboard
- Visit https://sentry.io
- View real-time errors and crashes
- Check session replays for debugging
- Set up email alerts for critical errors

### Vercel Analytics
- Visit https://vercel.com
- See deployment history
- Check edge function performance
- View real user monitoring

## 🆘 Common Issues

**Issue: "Sentry DSN not found"**
→ Add VITE_SENTRY_DSN to .env.production and rebuild

**Issue: "Pre-commit hook not running"**
→ Run: `npx husky install` again

**Issue: "Deploy failed on Vercel"**
→ Check logs at Vercel dashboard, usually TypeScript or build issues

## 🎓 Next Steps

1. Test error tracking by throwing an error in console
2. Monitor Sentry for issues
3. Set up GitHub branch protection (require reviews)
4. Add automated tests (Jest/Vitest)
5. Configure CI/CD for backend too

## 📚 Full Documentation

See `OPTION_B_IMPLEMENTATION.md` for complete details and troubleshooting.
