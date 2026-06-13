# Deploy Script - Automated Deployment

## Overview
This directory contains deployment automation scripts for Option B.

### Available Scripts

#### Windows (PowerShell)
```powershell
# Full deployment pipeline
.\deploy.ps1

# Or individual scripts:
.\scripts\setup-dependencies.ps1
.\scripts\setup-husky.ps1  
.\scripts\push-github.ps1
.\scripts\deploy-vercel.ps1
```

#### Linux/Mac/WSL (Bash)
```bash
# Full deployment pipeline
bash deploy.sh

# Or individual scripts:
bash scripts/setup-dependencies.sh
bash scripts/setup-husky.sh
bash scripts/push-github.sh
bash scripts/deploy-vercel.sh
```

## Pre-deployment Requirements

Before running deployment scripts, ensure:

1. **GitHub Account**
   - Created and access token generated
   - Username ready (e.g., `your-username`)

2. **Sentry Account**
   - Project created
   - DSN copied (format: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`)
   - Ready to add to .env.production

3. **Vercel Account**
   - Created
   - GitHub connected

4. **Environment Variables**
   - `frontend/.env.production` updated with:
     - `VITE_API_URL`: Your backend URL
     - `VITE_SENTRY_DSN`: Your Sentry DSN

## Quick Deploy (All-in-One)

### Windows
```powershell
cd "c:\Users\Usuario\Downloads\Ferramenta ADVGD"
.\deploy.ps1
```

### Linux/Mac/WSL
```bash
cd "c:\Users\Usuario\Downloads\Ferramenta ADVGD"
bash deploy.sh
```

## Step-by-Step Deployment

### 1. Setup Dependencies
**Windows:**
```powershell
.\scripts\setup-dependencies.ps1
```

**Linux/Mac:**
```bash
bash scripts/setup-dependencies.sh
```

What it does:
- Installs npm dependencies in frontend/
- Verifies Node.js and npm versions
- Checks for build issues

### 2. Setup Pre-commit Hooks
**Windows:**
```powershell
.\scripts\setup-husky.ps1
```

**Linux/Mac:**
```bash
bash scripts/setup-husky.sh
```

What it does:
- Installs Husky and lint-staged
- Creates pre-commit hook
- Prevents broken code from being committed

### 3. Push to GitHub
**Windows:**
```powershell
.\scripts\push-github.ps1
```

**Linux/Mac:**
```bash
bash scripts/push-github.sh
```

What it does:
- Commits all changes
- Renames branch to main
- Adds GitHub remote
- Pushes to repository

### 4. Deploy to Vercel
**Windows:**
```powershell
.\scripts\deploy-vercel.ps1
```

**Linux/Mac:**
```bash
bash scripts/deploy-vercel.sh
```

What it does:
- Installs Vercel CLI
- Authenticates with Vercel
- Deploys frontend/ directory
- Provides live URL

## Manual Deployment (No Scripts)

If scripts don't work for your setup:

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Get Sentry DSN
1. Visit https://sentry.io
2. Create/login to account
3. Create React project
4. Copy DSN
5. Update `frontend/.env.production`

### Step 3: Initialize Sentry
Edit `frontend/src/main.tsx`:
```typescript
import { initSentry } from "./services/sentry";
initSentry();
```

### Step 4: Setup Pre-commit Hooks
```bash
npm install husky lint-staged --save-dev
npx husky install
npx husky add .husky/pre-commit "npm run pre-commit"
```

Update `frontend/package.json`:
```json
"scripts": {
  "pre-commit": "lint-staged"
},
"lint-staged": {
  "src/**/*.{ts,tsx}": ["eslint --fix", "tsc --noEmit"]
}
```

### Step 5: Push to GitHub
```bash
git add .
git commit -m "feat: add Sentry error tracking and pre-commit hooks"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/advgd-crm.git
git push -u origin main
```

### Step 6: Deploy to Vercel
Option A - Via CLI:
```bash
npm install -g vercel
vercel login
vercel --prod
```

Option B - Via Dashboard:
1. Go to https://vercel.com
2. Import repository
3. Set root to `frontend`
4. Add environment variables
5. Deploy

## 🔍 Verification

After deployment, verify:

### GitHub
```bash
git remote -v
# Should show:
# origin  https://github.com/YOUR-USERNAME/advgd-crm.git (fetch)
# origin  https://github.com/YOUR-USERNAME/advgd-crm.git (push)
```

### Git History
```bash
git log --oneline -5
# Should show your commits
```

### Vercel
Visit your Vercel dashboard:
- https://vercel.com/dashboard

You should see:
- Your project deployed
- Live URL (e.g., advgd-crm.vercel.app)
- Deployment history
- Environment variables configured

### Sentry
Visit Sentry dashboard:
- https://sentry.io/organizations/YOUR-ORG/issues/

You should see:
- Performance data appearing
- Session tracking active
- Ready to capture production errors

## 🆘 Troubleshooting

### Issue: Scripts don't execute (Permission Denied)
**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: npm install fails
**Solution:**
```bash
rm -r node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: Git remote already exists
**Solution:**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/advgd-crm.git
```

### Issue: Deployment fails on Vercel
**Solution:**
1. Check Vercel logs: Deployments → View
2. Usually TypeScript or build errors
3. Fix locally: `npm run build`
4. Push again

## 📊 Expected Output

### Successful Setup
```
✓ Dependencies installed
✓ Husky configured
✓ Git initialized
✓ Code pushed to GitHub
✓ Deployed to Vercel
✓ Sentry monitoring active
✓ Live on: https://your-project.vercel.app
```

### Timeline
- Dependencies: 2-3 min
- Husky setup: 1 min
- GitHub push: 1 min
- Vercel deploy: 2-3 min
- **Total: ~8 minutes**

## 📝 Next Steps

After successful deployment:

1. **Monitor Errors**
   - Check Sentry dashboard daily
   - Set up email alerts for critical errors

2. **Setup CI/CD**
   - Branch protection rules in GitHub
   - Require PR reviews before merge

3. **Add Tests**
   - Unit tests with Vitest
   - E2E tests with Cypress

4. **Backend Deployment**
   - Deploy Node.js backend separately
   - Update VITE_API_URL in Vercel

5. **Custom Domain**
   - Add domain to Vercel
   - Configure SSL certificate

---

**Your app is now live in production!** 🚀
