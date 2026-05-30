# TROUBLESHOOTING - Common Issues & Solutions

## 🔧 Installation Issues

### Issue 1: npm install fails with "Permission Denied"

**Error Message:**
```
Error: EACCES: permission denied, open '/usr/local/lib/node_modules'
```

**Solutions:**

Option A - Change npm prefix:
```bash
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

Option B - Use sudo (not recommended):
```bash
sudo npm install -g npm@latest
```

Option C - Reinstall Node properly (recommended):
- Visit https://nodejs.org
- Download latest LTS version
- Reinstall Node.js
- Restart terminal

---

### Issue 2: "node_modules" folder is huge/slow

**Solution:**
```powershell
# Delete and reinstall
cd frontend
rm -r node_modules package-lock.json
npm install --legacy-peer-deps
```

---

### Issue 3: npm ERR! code ERESOLVE

**Error Message:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solution:**
```bash
npm install --legacy-peer-deps
```

Or update npm:
```bash
npm install -g npm@latest
npm install
```

---

## 🔐 Sentry Issues

### Issue 1: "Sentry DSN not configured"

**Error:**
```
Warning: Sentry DSN not configured
```

**Solution:**
1. Create Sentry account: https://sentry.io
2. Create React project
3. Copy DSN (format: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`)
4. Add to `frontend/.env.production`:
   ```
   VITE_SENTRY_DSN=https://your-dsn@org.ingest.sentry.io/projectid
   ```
5. Restart dev server or rebuild

---

### Issue 2: "Invalid Sentry DSN format"

**Error:**
```
Error: Invalid DSN
```

**Valid DSN format:**
```
https://KEY@DOMAIN.ingest.sentry.io/PROJECT_ID
```

**Common mistakes:**
- Missing `https://` → Add it
- Wrong domain → Use `ingest.sentry.io`
- Extra spaces → Remove them
- Copied wrong line → Make sure it's the full DSN

---

### Issue 3: Sentry not capturing errors

**Checklist:**
1. ✓ DSN is correct format
2. ✓ Sentry initialized in main.tsx BEFORE React render
3. ✓ Using VITE_SENTRY_DSN environment variable
4. ✓ Browser console shows Sentry initialized
5. ✓ Sentry project is active (not archived)

**Debug:**
Open browser console and run:
```javascript
// Should show initialized state
if (window.__SENTRY_RELEASE__) {
  console.log("✓ Sentry initialized");
} else {
  console.log("✗ Sentry not initialized");
}
```

---

## 🏗️ Build Issues

### Issue 1: "TypeScript compilation errors"

**Error:**
```
error TS2322: Type 'something' is not assignable to type 'something else'
```

**Solution:**
1. Run: `npm run type-check`
2. Read the error carefully
3. Check line numbers mentioned
4. Fix the type mismatch
5. Example:
   ```typescript
   // ❌ Wrong
   const num: number = "5";
   
   // ✅ Right
   const num: number = 5;
   ```

---

### Issue 2: Build works locally but fails on Vercel

**Common causes:**
1. Environment variables not set
2. Missing dependency in package.json
3. Path issues (Windows vs Linux)
4. Node version mismatch

**Solution:**
1. Check Vercel deployment logs
2. Try building in clean directory:
   ```bash
   rm -r frontend/dist
   npm run build
   ```
3. Check Node version on Vercel matches local
4. Add missing environment variables in Vercel dashboard

---

### Issue 3: "Cannot find module" error

**Error:**
```
Cannot find module '@sentry/react'
```

**Solution:**
```bash
cd frontend
npm install @sentry/react
```

Or if it exists:
```bash
rm -r node_modules
npm install
```

---

## 🚀 Deployment Issues

### Issue 1: "Vercel deployment failed"

**Steps to debug:**
1. Go to Vercel dashboard
2. Click "Deployments"
3. Click the failed deployment
4. Click "Runtime logs"
5. Read the error message
6. Common errors:
   - TypeScript error → Fix locally, push again
   - Missing env variable → Add in Vercel settings
   - Build timeout → Optimize code, try again

---

### Issue 2: "Site loads but shows blank page"

**Checklist:**
1. ✓ Open browser DevTools (F12)
2. ✓ Check Console tab for errors
3. ✓ Check Network tab for failed requests
4. ✓ Check if API_URL is correct
5. ✓ Check if backend is running

**Solution:**
1. Fix errors shown in console
2. Verify environment variables are correct
3. Check backend API is accessible
4. Push fixes to GitHub (auto-redeploys)

---

### Issue 3: "504 Gateway Timeout"

**Cause:** Build taking too long or backend not responding

**Solution:**
1. Optimize code/bundle
2. Vercel retries automatically
3. If persists, check backend availability
4. Try redeploying

---

## 🔄 Git Issues

### Issue 1: "Permission denied" when pushing

**Error:**
```
Permission denied (publickey).
fatal: Could not read from remote repository.
```

**Solutions:**

Option A - Use HTTPS with token (easier):
```powershell
git remote remove origin
git remote add origin https://YOUR-TOKEN@github.com/YOUR-USERNAME/advgd-crm.git
git push -u origin main
```

Option B - Setup SSH key:
```bash
ssh-keygen -t ed25519 -C "your@email.com"
# Follow prompts, press Enter for defaults
cat ~/.ssh/id_ed25519.pub
# Copy output and add to GitHub: Settings → SSH Keys
git remote set-url origin git@github.com:YOUR-USERNAME/advgd-crm.git
```

---

### Issue 2: "remote already exists"

**Error:**
```
fatal: remote origin already exists.
```

**Solution:**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/advgd-crm.git
git push -u origin main
```

---

### Issue 3: "branch main doesn't exist"

**Error:**
```
error: refspec main does not match any
```

**Solution:**
```bash
# Check current branch
git branch

# Rename to main
git branch -M main

# Try pushing again
git push -u origin main
```

---

## 🎣 Pre-commit Hook Issues

### Issue 1: Pre-commit hook not running

**Symptom:** Can commit broken code

**Solution:**
```bash
cd frontend
npx husky install
npx husky add .husky/pre-commit "npm run pre-commit"
```

Verify hook exists:
```bash
cat .husky/pre-commit
# Should show: npm run pre-commit
```

---

### Issue 2: "Cannot find npm run pre-commit"

**Error:**
```
npm ERR! Unknown command: "pre-commit"
```

**Solution:**
Update `frontend/package.json` scripts:
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

---

### Issue 3: Want to bypass pre-commit hook

**For emergency commits:**
```bash
git commit --no-verify -m "emergency: fix critical bug"
```

⚠️ Use sparingly!

---

## 📊 Performance Issues

### Issue 1: Build is very slow

**Cause:** Large dependencies, many files

**Solutions:**
```bash
# Check build size
npm run build -- --debug

# Analyze bundle
npm install -g source-map-explorer
source-map-explorer 'dist/*.js'
```

**Optimization:**
- Remove unused dependencies
- Split code into chunks
- Lazy load routes
- Compress images

---

### Issue 2: App loads slowly

**Checklist:**
1. ✓ Check Network tab (DevTools)
2. ✓ Identify slow requests
3. ✓ Check API response times
4. ✓ Check bundle size (should be < 300KB JS)

**Optimize:**
- Minify JavaScript
- Compress images
- Add caching headers
- Use CDN for static assets

---

## 🔍 Debugging Tips

### Enable Debug Mode

```typescript
// In frontend/src/services/sentry.ts
Sentry.init({
  debug: true,  // ← Add this
  // ... rest of config
});
```

### Check Environment Variables

```bash
# On Vercel, go to Project Settings → Environment Variables
# Verify all VITE_ variables are set correctly

# Locally, check:
echo $VITE_SENTRY_DSN
```

### Use Browser DevTools

**Console Tab:**
- See all console logs
- See JavaScript errors
- Run JavaScript commands

**Network Tab:**
- See all HTTP requests
- Check response codes
- See response times

**Application Tab:**
- Check environment variables
- Check local storage
- Check cookies

---

## 🆘 Still Stuck?

### Resources

1. **Sentry Docs:** https://docs.sentry.io/
2. **Vercel Docs:** https://vercel.com/docs
3. **GitHub Docs:** https://docs.github.com
4. **Vite Docs:** https://vitejs.dev
5. **React Docs:** https://react.dev

### Get Help

1. Check documentation files:
   - `QUICK_START_OPTION_B.md`
   - `OPTION_B_IMPLEMENTATION.md`
   - `SENTRY_LOCAL_TESTING.md`

2. Search online:
   - Copy error message into Google
   - Add package name (e.g., "vite error something")
   - Check Stack Overflow

3. Check package documentation:
   - `npm info PACKAGE_NAME`
   - Visit npmjs.com/package/PACKAGE_NAME

---

## ✅ Known Working Configurations

### Tested Stack
- Node.js: v18.17.0 or v20.9.0
- npm: v9.6.7 or v10.1.0
- React: 18.2.0
- Vite: 5.0.0
- TypeScript: 5.3.0
- Sentry: 7.91.0

### Browser Support
- Chrome: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Edge: Latest 2 versions

---

## 📝 Create Issue Report

If you find a bug, create a report:

1. **Title:** Brief description
   - "npm install fails with Node 16"
   - "Sentry DSN validation rejects valid DSN"

2. **Environment:**
   - Node version: `node --version`
   - npm version: `npm --version`
   - OS: Windows / Mac / Linux

3. **Steps to Reproduce:**
   - Exact commands run
   - Exact error message
   - What you expected to happen

4. **Logs:**
   - Full error messages
   - Relevant code snippets

---

**Remember:** Most errors are easily fixed with a quick search! 🔍
