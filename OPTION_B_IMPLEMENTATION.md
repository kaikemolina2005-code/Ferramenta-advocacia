# Option B Implementation - Error Tracking & Security Setup

## ✅ Completed Steps

### 1. Sentry Dependency Added
- Added `@sentry/react@^7.91.0` to `frontend/package.json`
- Location: [frontend/src/services/sentry.ts](frontend/src/services/sentry.ts)

**File Contents:**
- `initSentry()` - Initialize Sentry with DSN and configuration
- `captureException()` - Manually capture errors with context
- `captureMessage()` - Log messages to Sentry
- `setUser()` - Track user sessions
- `addBreadcrumb()` - Add event tracking breadcrumbs

### 2. Environment Configuration
- Created `frontend/.env.production` with production URLs
- Sentry DSN placeholder ready for configuration

### 3. Pre-commit Hooks Setup
- Scripts created for both Linux/Mac and Windows:
  - `setup-husky.sh` (Linux/Mac/WSL)
  - `setup-husky.ps1` (Windows PowerShell)

## ⏳ Next Steps (Manual Actions Required)

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Create Sentry Account & Get DSN
1. Visit [sentry.io](https://sentry.io)
2. Create account and organization
3. Create project for React (will generate DSN)
4. Copy DSN and update `frontend/.env.production`

### Step 3: Initialize Sentry in main.tsx
Update `frontend/src/main.tsx`:

```typescript
import { initSentry } from "./services/sentry";

// Initialize Sentry BEFORE rendering app
initSentry();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Step 4: Update package.json with Pre-commit & Lint-staged
In `frontend/package.json`, add to scripts and root:

**Scripts section:**
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

**Root level (after devDependencies):**
```json
"lint-staged": {
  "src/**/*.{ts,tsx}": [
    "eslint --fix",
    "tsc --noEmit"
  ]
}
```

### Step 5: Setup Husky (Choose One)

**Option A - Windows (PowerShell):**
```powershell
cd frontend
.\setup-husky.ps1
```

**Option B - Linux/Mac/WSL:**
```bash
cd frontend
bash ../setup-husky.sh
```

### Step 6: Verify Pre-commit Hook
```bash
cat .husky/pre-commit
```

Should output:
```
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run pre-commit
```

### Step 7: Push to GitHub
```bash
git add .
git commit -m "feat: add Sentry error tracking and pre-commit hooks"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/advgd-crm.git
git push -u origin main
```

### Step 8: Deploy to Vercel

**Option A - Via CLI:**
```bash
npm install -g vercel
vercel login
cd frontend
vercel --prod
```

**Option B - Via Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Import repository
3. Select `frontend` directory as root
4. Add environment variables:
   - `VITE_API_URL`: Your backend production URL
   - `VITE_SENTRY_DSN`: Your Sentry DSN
5. Deploy

### Step 9: Configure Vercel Environment Variables
In Vercel Dashboard:
1. Project Settings → Environment Variables
2. Add for Production:
   - `VITE_API_URL`: `https://api.advgd-crm.com` (update with your domain)
   - `VITE_WS_URL`: `wss://api.advgd-crm.com` (update with your domain)
   - `VITE_SENTRY_DSN`: Your Sentry project DSN

## 🔍 Validation Checklist

- [ ] npm install completes without errors
- [ ] Sentry DSN obtained and added to .env.production
- [ ] Sentry initialized in frontend/src/main.tsx
- [ ] lint-staged configured in package.json
- [ ] Pre-commit hook successfully created
- [ ] Git branch renamed to main
- [ ] GitHub remote added
- [ ] Initial push to GitHub successful
- [ ] Vercel project created
- [ ] Vercel environment variables configured
- [ ] Deployment successful
- [ ] Application accessible at Vercel domain
- [ ] Sentry receiving events

## 📊 Production Monitoring Setup

### Error Tracking
- All unhandled errors captured automatically
- Session replay enabled for 10% of sessions
- Errors trigger 100% replay for debugging
- Network errors filtered to reduce noise

### Performance Monitoring
- 10% of transactions sampled in production
- 100% in development for debugging
- Session tracking enabled

### User Context
- User ID tracked for all errors
- Session identification in Sentry dashboard
- Breadcrumb trail of events leading to errors

## 🚀 After Deployment

### Monitor in Sentry
1. Visit https://sentry.io/organizations/YOUR-ORG/issues/
2. Watch for production errors
3. Set up alerts for critical issues
4. Review session replays for debugging

### GitHub & Vercel Integration
- Automatic deployments on push to main
- Preview deployments for PRs
- Automatic rollback on build failures

## 📝 Notes

- Pre-commit hooks run on every commit
- Linting errors prevent commits (can use --no-verify to bypass)
- Type checking ensures TypeScript compilation succeeds
- Sentry errors filtered to prevent noise
- Session replay limited to conserve bandwidth
