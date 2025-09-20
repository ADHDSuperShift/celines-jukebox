# Spotify Integration Setup Guide

## 1. Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)
2. Click "Create an App"
3. Fill in:
   - **App name**: "Celine's Jukebox"
   - **App description**: "Retro vinyl jukebox web application"
   - **Website**: Your deployed URL (e.g., https://yourusername.github.io/celines-jukebox)
   - **Redirect URI**: Add your app URL (both localhost for dev and production URL)
     - `http://localhost:8080` (for development)
     - `https://yourusername.github.io/celines-jukebox` (for production)

## 2. Get Your Client ID

1. After creating the app, you'll see your **Client ID** on the app dashboard
2. Copy this Client ID

## 3. Configure Environment Variables

1. Create a `.env` file in your project root:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Spotify Client ID:
   ```
   VITE_SPOTIFY_CLIENT_ID=your_actual_client_id_here
   ```

## 4. Important Settings

- **Redirect URIs**: Must match exactly where your app is hosted
- **Users**: During development, you'll need to add user emails in the Spotify app settings
- **Quota Extension**: For production use, you'll need to request quota extension from Spotify

## 5. User Requirements

- Users need a **Spotify Premium** account to use the Web Playbook SDK
- Free Spotify accounts cannot control playback through the API

## 6. Testing

1. Make sure Spotify is running on the user's device
2. The app will create a new device called "Celine's Jukebox" in Spotify
3. Music will play through this web player device

## Troubleshooting

- **"Invalid client"**: Check your Client ID and redirect URIs
- **"Premium required"**: User needs Spotify Premium
- **"No active device"**: Make sure Spotify app is running somewhere
- **"Player not ready"**: Wait a few seconds after login for SDK to initialize
