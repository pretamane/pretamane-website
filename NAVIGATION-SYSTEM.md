# Navigation Component System with Google Authentication

## Overview
This website now uses a component-based navigation system that ensures consistency across all pages and maintains Google Sign-In state globally.

## Architecture

### 1. **Navigation Component** (`/assets/js/nav-component.js`)
- Dynamically injects the navigation bar HTML into every page
- Ensures all pages have identical navigation structure
- Includes Google Sign-In button and user profile elements
- **Single source of truth**: Update nav in ONE place, applies to ALL pages

### 2. **Google Authentication** (`/assets/js/google-auth.js`)
- Handles Google Sign-In OAuth flow
- Uses `localStorage` for persistent state management
- Automatically restores user session across pages and page refreshes
- Provides sign-out functionality (click on profile to sign out)

### 3. **State Management**
```javascript
// User data stored in localStorage
{
  id: "user_google_id",
  name: "User Name",
  givenName: "First",
  familyName: "Last",
  picture: "https://profile-pic-url",
  email: "user@gmail.com"
}
```

## How It Works

### Page Load Sequence:
1. HTML loads (without navigation)
2. `nav-component.js` executes → Injects navigation HTML
3. Google Identity Services library loads
4. `google-auth.js` executes → Checks localStorage for existing session
5. UI updates based on authentication state

### Sign-In Flow:
1. User clicks "Sign In" button
2. Google popup appears
3. User selects Google account
4. `handleCredentialResponse()` called with JWT token
5. Token decoded, user data extracted
6. Data saved to localStorage
7. UI updated (button hidden, profile shown)

### Sign-Out Flow:
1. User clicks on their profile picture/name
2. Confirmation dialog appears
3. If confirmed: localStorage cleared, page reloads
4. Navigation shows "Sign In" button again

## File Structure
```
pretamane-website/
├── assets/
│   └── js/
│       ├── nav-component.js      # Navigation HTML injection
│       ├── google-auth.js         # Authentication & state management
│       └── navigation.js          # Mobile menu toggle
├── index.html                     # Uses component system
└── pages/
    ├── about.html                 # Uses component system
    ├── services.html              # Uses component system
    ├── contact.html               # Uses component system
    ├── analytics.html             # Uses component system
    ├── upload.html                # Uses component system
    ├── search.html                # Uses component system
    ├── health.html                # Uses component system
    └── portfolio.html             # Uses component system
```

## Required Scripts on Every Page
```html
<!-- At the bottom of every page, before </body> -->
<script src="/assets/js/nav-component.js"></script>
<script src="/assets/js/navigation.js"></script>
<!-- Google Identity Services -->
<script src="https://accounts.google.com/gsi/client" async defer></script>
<script src="/assets/js/google-auth.js"></script>
```

## Google Cloud Console Configuration

### Current Client ID:
```
881572313374-qmautsh2vauq7oveeftt9cgvg3rv74de.apps.googleusercontent.com
```

### Required Settings:
1. **Application Type**: Web application
2. **Authorized JavaScript Origins**:
   - `http://localhost:8000` (for local development)
   - `https://pretamane.com` (for production)
   - Add any staging/preview URLs as needed

### How to Update:
1. Go to [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on the Client ID
3. Add/Remove origins as needed
4. Click "Save"
5. Wait 5-10 minutes for changes to propagate

## Making Changes

### To Update Navigation (buttons, links, styling):
**Edit ONLY**: `/assets/js/nav-component.js`
- Modify the `NAV_HTML` constant
- Changes apply to all pages immediately

### To Update Client ID:
**Edit ONLY**: `/assets/js/nav-component.js`
- Find `data-client_id` attribute
- Replace with new Client ID
- Changes apply to all pages immediately

### To Modify Authentication Logic:
**Edit**: `/assets/js/google-auth.js`
- Handles sign-in/sign-out
- State persistence
- UI updates

## Benefits of This System

✅ **Single Source of Truth**: Navigation defined in one place
✅ **Consistent Experience**: All pages share identical nav
✅ **Persistent State**: Login survives page navigation & refreshes
✅ **Easy Maintenance**: Update nav once, affects all pages
✅ **Separation of Concerns**: Nav, auth, and page content are separate
✅ **Scalable**: Easy to add new pages - just include the scripts

## Troubleshooting

### Navigation not appearing:
- Check browser console for JavaScript errors
- Ensure `nav-component.js` is loaded before other scripts
- Verify path: `/assets/js/nav-component.js`

### Google Sign-In not working:
1. Check console for `invalid_client` or `origin_mismatch` errors
2. Verify origin in Google Cloud Console matches exactly
3. Clear browser cache and try incognito mode
4. Ensure `google-auth.js` is loading after GSI library

### State not persisting:
- Check if localStorage is enabled in browser
- Open DevTools → Application → Local Storage
- Look for key: `google_auth_user`

## Testing Checklist

Before deploying:
- [ ] Test navigation on all pages (8 pages total)
- [ ] Test Google Sign-In flow
- [ ] Test sign-out flow
- [ ] Test state persistence across page navigation
- [ ] Test on mobile (responsive design)
- [ ] Verify all links work
- [ ] Check browser console for errors
- [ ] Test in incognito mode
- [ ] Add production domain to Google Cloud Console

## Future Enhancements

Possible improvements:
- Add session expiration (auto sign-out after X hours)
- Add user preferences storage
- Add protected pages (require login to view)
- Integrate with backend API for user data
- Add social features (comments, likes, etc.)
