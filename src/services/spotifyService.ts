// Spotify Web Player service for reliable audio playback
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

class SpotifyService {
  private player: any = null;
  private deviceId: string = '';
  private accessToken: string = '';
  private isInitialized = false;

  async initialize(accessToken: string): Promise<boolean> {
    this.accessToken = accessToken;
    
    return new Promise((resolve) => {
      // Load Spotify Web Playback SDK
      if (!document.querySelector('script[src*="sdk.scdn.co"]')) {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.head.appendChild(script);
      }

      window.onSpotifyWebPlaybackSDKReady = () => {
        this.initializePlayer();
        resolve(true);
      };

      // If SDK is already loaded
      if (window.Spotify) {
        this.initializePlayer();
        resolve(true);
      }
    });
  }

  private initializePlayer() {
    this.player = new window.Spotify.Player({
      name: "Celine's Jukebox",
      getOAuthToken: (cb: (token: string) => void) => {
        cb(this.accessToken);
      },
      volume: 0.8
    });

    // Error handling
    this.player.addListener('initialization_error', ({ message }: any) => {
      console.error('Spotify initialization error:', message);
    });

    this.player.addListener('authentication_error', ({ message }: any) => {
      console.error('Spotify authentication error:', message);
    });

    this.player.addListener('account_error', ({ message }: any) => {
      console.error('Spotify account error:', message);
    });

    this.player.addListener('playback_error', ({ message }: any) => {
      console.error('Spotify playback error:', message);
    });

    // Playback status updates
    this.player.addListener('player_state_changed', (state: any) => {
      if (!state) return;
      console.log('Spotify player state changed:', state);
    });

    // Ready
    this.player.addListener('ready', ({ device_id }: any) => {
      console.log('Spotify player ready with Device ID:', device_id);
      this.deviceId = device_id;
      this.isInitialized = true;
    });

    // Not Ready
    this.player.addListener('not_ready', ({ device_id }: any) => {
      console.log('Spotify player not ready with Device ID:', device_id);
    });

    // Connect to the player
    this.player.connect();
  }

  async playTrack(spotifyUri: string): Promise<boolean> {
    if (!this.isInitialized || !this.deviceId) {
      console.error('Spotify player not ready');
      return false;
    }

    try {
      // Transfer playback to our device and play the track
      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({
          uris: [spotifyUri]
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
      });

      if (response.ok) {
        console.log('Successfully started Spotify playback');
        return true;
      } else {
        console.error('Failed to start Spotify playback:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error playing Spotify track:', error);
      return false;
    }
  }

  async pause(): Promise<void> {
    if (this.player) {
      await this.player.pause();
    }
  }

  async resume(): Promise<void> {
    if (this.player) {
      await this.player.resume();
    }
  }

  async seek(positionMs: number): Promise<void> {
    if (this.player) {
      await this.player.seek(positionMs);
    }
  }

  async setVolume(volume: number): Promise<void> {
    if (this.player) {
      await this.player.setVolume(volume);
    }
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  getDeviceId(): string {
    return this.deviceId;
  }

  disconnect(): void {
    if (this.player) {
      this.player.disconnect();
    }
    this.isInitialized = false;
    this.deviceId = '';
  }
}

export const spotifyService = new SpotifyService();
