# Testing Sentry Locally - Option B Validation

## Before Deploying to Production

Test Sentry error tracking in development to ensure it's working correctly.

## 🧪 Local Testing Setup

### 1. Create a Test Component
Create `frontend/src/components/SentryTest.tsx`:

```typescript
import { captureException, addBreadcrumb } from "../services/sentry";

export function SentryTest() {
  const handleTestError = () => {
    addBreadcrumb("User clicked test error button", "user-interaction");
    
    try {
      // This will cause an error
      throw new Error("This is a test error for Sentry");
    } catch (error) {
      if (error instanceof Error) {
        captureException(error, {
          component: "SentryTest",
          action: "handleTestError",
        });
      }
    }
  };

  const handleAsyncError = async () => {
    addBreadcrumb("Starting async test", "async-operation");
    
    try {
      await new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Async test error")), 1000)
      );
    } catch (error) {
      if (error instanceof Error) {
        captureException(error, {
          type: "async",
        });
      }
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid red", margin: "10px" }}>
      <h3>🧪 Sentry Test Panel</h3>
      <button onClick={handleTestError} style={{ marginRight: "10px", padding: "10px" }}>
        Test Sync Error
      </button>
      <button onClick={handleAsyncError} style={{ padding: "10px" }}>
        Test Async Error
      </button>
      <p>
        <small>
          Click buttons above and check:
          <br />1. Browser console for Sentry debug logs
          <br />2. Sentry dashboard for reported errors
        </small>
      </p>
    </div>
  );
}
```

### 2. Add to Your App for Testing
Edit `frontend/src/App.tsx` and add temporarily (remove before production):

```typescript
import { SentryTest } from "./components/SentryTest";

export function App() {
  return (
    <div>
      {/* Add this only for testing */}
      <SentryTest />
      
      {/* Rest of your app */}
      {/* ... */}
    </div>
  );
}
```

## 🔧 Environment Setup for Testing

### Option 1: Use Development Sentry DSN
Create `frontend/.env.development`:

```bash
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
VITE_SENTRY_DSN=https://your-dev-sentry-dsn@xxxxx.ingest.sentry.io/xxxxx
```

### Option 2: Skip Sentry in Dev (Test in Production Build)
Edit `frontend/src/services/sentry.ts`:

```typescript
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const environment = import.meta.env.MODE;

  // Skip in development if no DSN
  if (!dsn) {
    console.warn("Sentry DSN not configured");
    return;
  }

  // ... rest of initialization
}
```

## 🚀 Run Tests

### Test 1: Development Mode
```bash
cd frontend
npm run dev
# Open http://localhost:5173
# Click buttons to test errors
# Check console for logs
```

### Test 2: Production Build Locally
```bash
cd frontend
npm run build
npm run preview
# Open http://localhost:4173
# Click buttons to test errors
```

## ✅ Validation Checklist

### Browser Console (F12)
- [ ] See `Sentry initialized` or similar message
- [ ] No console errors on startup
- [ ] Sentry events logged when buttons clicked
- [ ] Breadcrumbs visible in console

### Sentry Dashboard
- [ ] Log into https://sentry.io
- [ ] Go to Issues section
- [ ] See test errors appear in real-time
- [ ] Error details show:
  - Error message
  - Stack trace
  - Browser/OS info
  - Breadcrumbs
  - Custom context

### Network Tab (DevTools → Network)
- [ ] Look for requests to `ingest.sentry.io`
- [ ] Status should be 200 or 204 (success)
- [ ] POST requests with error data

## 🐛 Debugging Sentry Configuration

### Check Initialization
Add this to your console to debug:

```javascript
// Open DevTools console and run:
window.__SENTRY_DEBUG__ = true;
```

### Verify DSN Format
DSN should look like:
```
https://public-key@org.ingest.sentry.io/project-id
```

### Enable Debug Mode
Update `frontend/src/services/sentry.ts`:

```typescript
import * as Sentry from "@sentry/react";

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    debug: true,  // Enable debug logs
    // ... rest of config
  });
}
```

## 🧹 Cleanup Before Production

### Remove Test Component
```bash
rm frontend/src/components/SentryTest.tsx
```

### Remove from App.tsx
Remove this from `frontend/src/App.tsx`:
```typescript
import { SentryTest } from "./components/SentryTest";
// ...
<SentryTest />
```

### Verify Error Handling
Make sure Sentry initialization doesn't break if DSN is missing:

```typescript
if (!dsn) {
  console.warn("Sentry DSN not configured - error tracking disabled");
  return;
}
```

## 📊 Expected Test Results

### Successful Initialization
```
✓ Sentry initialized with DSN
✓ Environment: development
✓ Trace sample rate: 100%
✓ Ready to capture events
```

### Successful Error Capture
```
✓ Error thrown and caught
✓ Sent to Sentry (visible in Network tab)
✓ Appears in Sentry dashboard within seconds
✓ Shows full stack trace
✓ Includes breadcrumbs
```

## 🎯 Production Checklist Before Deployment

- [ ] Sentry account created and verified
- [ ] Sentry DSN added to `.env.production`
- [ ] Test component removed from codebase
- [ ] SentryTest imports removed from App.tsx
- [ ] Sentry initialized in `main.tsx` BEFORE React render
- [ ] No console errors on startup
- [ ] Production build completes successfully
- [ ] Errors are captured in Sentry dashboard
- [ ] Network requests show Sentry events being sent

## 🚨 Common Issues

### Issue: DSN not found
```
Error: Sentry DSN not configured
```
**Solution:** Add VITE_SENTRY_DSN to .env.production

### Issue: Events not appearing in Sentry
1. Check DSN is correct
2. Verify Sentry project exists
3. Check browser console for errors
4. Look at Network tab for Sentry requests

### Issue: Too many events (spam)
Sentry provides event filtering:
1. Go to Sentry dashboard
2. Project settings → Inbound Filters
3. Configure what to ignore

### Issue: Private data in events
By default, Sentry doesn't capture:
- Passwords or auth tokens
- Credit card numbers
- Email addresses (configurable)

See `beforeSend` hook in sentry.ts to customize filtering.

---

**After testing successfully, remove test code and deploy to production!**
