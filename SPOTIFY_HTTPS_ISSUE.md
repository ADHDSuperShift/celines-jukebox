# Spotify Development Workaround

## Problem
Spotify requires HTTPS redirect URIs, but localhost HTTPS is causing SSL errors.

## Solution Options:

### Option 1: Use GitHub Pages (Recommended)
1. Deploy to GitHub Pages first: `npm run deploy`
2. Use GitHub Pages URL as redirect URI: `https://adhdshupershift.github.io/celines-jukebox/`
3. Test Spotify integration on the live site

### Option 2: Use ngrok (Alternative)
1. Install ngrok: `brew install ngrok` (macOS)
2. Run: `ngrok http 3000`
3. Use the HTTPS URL ngrok provides as redirect URI

### Option 3: Revert to YouTube (Temporary)
Keep YouTube integration while Spotify HTTPS is being resolved.

## Current Status
- App running on HTTP: http://localhost:3000
- Spotify requires HTTPS redirect URI
- GitHub Pages provides automatic HTTPS
