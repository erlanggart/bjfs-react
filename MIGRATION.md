# Migration Guide: Frontend Separation

This document guides you through migrating the frontend from the monorepo to a separate repository.

## Overview

**Before**: `/bogorjuniorfs/bogorjunior` (inside monorepo)  
**After**: Separate repository with independent deployment

## Steps

### 1. Copy Frontend Files

```bash
# Create new directory for frontend
mkdir -p /home/erlangga/Projects/bogorjunior-frontend

# Copy all frontend files
cp -r /home/erlangga/Projects/bogorjuniorfs/bogorjunior/* /home/erlangga/Projects/bogorjunior-frontend/

# Copy documentation if needed
cp /home/erlangga/Projects/bogorjuniorfs/docs/* /home/erlangga/Projects/bogorjunior-frontend/docs/
```

### 2. Initialize Git Repository

```bash
cd /home/erlangga/Projects/bogorjunior-frontend

# Initialize git
git init

# Create .gitignore (already created)
# Add files
git add .
git commit -m "Initial commit: Frontend separation from monorepo"

# Add remote repository
git remote add origin <your-frontend-repo-url>
git branch -M main
git push -u origin main
```

### 3. Update API Configuration

The API service files have been created in `/src/services/`:
- `api.js` - Axios instance with interceptors
- `apiService.js` - All API endpoint functions

**Update all component imports:**

**Before (old PHP endpoints):**
```javascript
// Old way - direct fetch to PHP files
fetch('http://localhost/bogor_junior_api/api/auth/login.php', {
  method: 'POST',
  body: JSON.stringify({ username, password })
})
```

**After (new Express endpoints):**
```javascript
// New way - use service functions
import { authService } from '../services/apiService';

const response = await authService.login(username, password);
```

### 4. Update Component Files

You need to update these files to use the new API services:

1. **Authentication components**:
   - Update login/register forms to use `authService`
   
2. **Member components**:
   - Replace PHP endpoints with `memberService`
   
3. **Attendance components**:
   - Replace PHP endpoints with `attendanceService`
   
4. **Branch components**:
   - Replace PHP endpoints with `branchService`
   
5. **Schedule components**:
   - Replace PHP endpoints with `scheduleService`
   
6. **Analytics components**:
   - Replace PHP endpoints with `analyticsService`

### 5. Environment Configuration

Create `.env` file:
```bash
cp .env.example .env
```

Update for development:
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Bogor Junior FS
```

Update for production:
```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Bogor Junior FS
```

### 6. Update File Upload Components

**Before:**
```javascript
const formData = new FormData();
formData.append('file', file);

fetch('http://localhost/bogor_junior_api/api/upload.php', {
  method: 'POST',
  body: formData
})
```

**After:**
```javascript
import { uploadFile } from '../services/apiService';

const result = await uploadFile(file, 'avatars'); // or 'documents', 'hero', etc.
```

### 7. Authentication Token Storage

The new backend uses JWT tokens instead of cookies.

**Update your auth context/hook:**

```javascript
// Login
const { token, user } = await authService.login(username, password);
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));

// Logout
await authService.logout();
localStorage.removeItem('token');
localStorage.removeItem('user');

// Get current user
const { user } = await authService.getMe();
```

### 8. Testing Migration

1. Start backend server:
```bash
cd /home/erlangga/Projects/bogorjunior-backend
npm run dev
```

2. Start frontend development server:
```bash
cd /home/erlangga/Projects/bogorjunior-frontend
npm run dev
```

3. Test all features:
   - [ ] Login/Logout
   - [ ] Member CRUD operations
   - [ ] Attendance marking
   - [ ] Schedule management
   - [ ] File uploads
   - [ ] Analytics dashboard

### 9. Update Component Example

**Example: Login Component**

**Before:**
```javascript
const handleLogin = async (e) => {
  e.preventDefault();
  
  const response = await fetch('http://localhost/bogor_junior_api/api/auth/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  // ...
};
```

**After:**
```javascript
import { authService } from '../services/apiService';

const handleLogin = async (e) => {
  e.preventDefault();
  
  try {
    const { token, user } = await authService.login(username, password);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    // Navigate to dashboard
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### 10. Component Files to Update

Search and replace in these directories:
```bash
cd /home/erlangga/Projects/bogorjunior-frontend

# Find all API calls
grep -r "fetch.*bogor_junior_api" src/
grep -r "axios.*bogor_junior_api" src/

# Update imports
# Replace all fetch/axios calls with service functions
```

Common patterns to replace:
- `fetch('...bogor_junior_api/api/...` → Import and use service functions
- `credentials: 'include'` → Remove (JWT in headers now)
- Cookie handling → Use localStorage for token

### 11. CORS Configuration

Make sure backend `.env` has correct CORS origin:
```env
CORS_ORIGIN=http://localhost:5173
```

For production:
```env
CORS_ORIGIN=https://yourdomain.com
```

### 12. Deployment

After migration is complete:

**Frontend:**
```bash
# Build
npm run build

# Deploy dist/ folder to hosting
```

**Backend:**
```bash
# Already set up with PM2
pm2 restart bogorjunior-backend
```

## Checklist

- [ ] Copy frontend files to new directory
- [ ] Initialize git repository
- [ ] Create and configure .env file
- [ ] Update all API calls to use new services
- [ ] Update authentication to use JWT tokens
- [ ] Update file upload components
- [ ] Test all features locally
- [ ] Update CORS configuration
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Test production deployment

## Rollback Plan

If issues occur:
1. Keep old monorepo running
2. Point frontend back to old PHP backend
3. Debug and fix new implementation
4. Retry migration

## Support

For issues during migration, check:
- Backend logs: `pm2 logs bogorjunior-backend`
- Frontend console errors
- Network tab in browser DevTools
- CORS errors in console
