import { useState, useEffect } from 'react';
import { spotifyService } from '@/services/spotifyService';

export const useSpotify = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Spotify app credentials (you'll need to register your app)
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'your_spotify_client_id';
  const REDIRECT_URI = window.location.origin + window.location.pathname;
  const SCOPES = 'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state';

  console.log('Current location:', window.location.href);
  console.log('Redirect URI will be:', REDIRECT_URI);

  useEffect(() => {
    // Check if we have an access token in URL (after OAuth redirect)
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const token = urlParams.get('access_token');
    
    if (token) {
      setAccessToken(token);
      initializeSpotify(token);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const initializeSpotify = async (token: string) => {
    setIsInitializing(true);
    try {
      const success = await spotifyService.initialize(token);
      setIsConnected(success);
    } catch (error) {
      console.error('Failed to initialize Spotify:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const disconnect = (): void => {
    spotifyService.disconnect();
    setIsConnected(false);
    setAccessToken('');
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  const connectSpotify = () => {
    console.log('Redirect URI being used:', REDIRECT_URI);
    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${CLIENT_ID}&` +
      `response_type=token&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `scope=${encodeURIComponent(SCOPES)}`;
    
    console.log('Full auth URL:', authUrl);
    window.location.href = authUrl;
  };

  const login = connectSpotify; // Alias for easier naming
  const logout = disconnect; // Alias for easier naming

  const playTrack = async (spotifyUri: string): Promise<boolean> => {
    const success = await spotifyService.playTrack(spotifyUri);
    if (success) {
      setIsPlaying(true);
      // You could also get track info here
    }
    return success;
  };

  const pause = async (): Promise<void> => {
    await spotifyService.pause();
    setIsPlaying(false);
  };

  const resume = async (): Promise<void> => {
    await spotifyService.resume();
    setIsPlaying(true);
  };

  return {
    isConnected,
    isInitializing,
    isAuthenticated: isConnected, // Alias
    isPlayerReady: isConnected, // For now, same as connected
    currentTrack,
    isPlaying,
    connectSpotify,
    login,
    logout,
    playTrack,
    pause,
    resume,
    disconnect
  };
};
