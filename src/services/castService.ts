// Google Cast service for Chromecast functionality
declare global {
  interface Window {
    cast: any;
    chrome: any;
    __onGCastApiAvailable: (isAvailable: boolean) => void;
  }
}

class CastService {
  private castContext: any = null;
  private player: any = null;
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.isInitialized) {
        resolve(true);
        return;
      }

      window.__onGCastApiAvailable = (isAvailable: boolean) => {
        if (isAvailable) {
          this.initializeCastApi();
          resolve(true);
        } else {
          console.error('Google Cast API not available');
          resolve(false);
        }
      };

      // If Cast API is already loaded
      if (window.cast && window.cast.framework) {
        this.initializeCastApi();
        resolve(true);
      }
    });
  }

  private initializeCastApi() {
    const context = window.cast.framework.CastContext.getInstance();
    
    context.setOptions({
      receiverApplicationId: window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    });

    this.castContext = context;
    this.isInitialized = true;

    // Listen for cast state changes
    context.addEventListener(
      window.cast.framework.CastContextEventType.CAST_STATE_CHANGED,
      (event: any) => {
        console.log('Cast state changed:', event.castState);
      }
    );
  }

  async castYouTubeVideo(videoId: string, title: string, artist: string, albumCover: string): Promise<boolean> {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) return false;
    }

    try {
      const session = this.castContext.getCurrentSession();
      if (!session) {
        // Request a cast session
        await this.castContext.requestSession();
        const newSession = this.castContext.getCurrentSession();
        if (!newSession) {
          throw new Error('Failed to establish cast session');
        }
      }

      const mediaInfo = new window.chrome.cast.media.MediaInfo(
        `https://www.youtube.com/watch?v=${videoId}`,
        'video/mp4'
      );

      mediaInfo.metadata = new window.chrome.cast.media.MusicTrackMediaMetadata();
      mediaInfo.metadata.title = title;
      mediaInfo.metadata.artist = artist;
      mediaInfo.metadata.albumName = 'Celine\'s Jukebox';
      
      if (albumCover) {
        mediaInfo.metadata.images = [
          new window.chrome.cast.Image(albumCover)
        ];
      }

      const request = new window.chrome.cast.media.LoadRequest(mediaInfo);
      request.autoplay = true;

      const currentSession = this.castContext.getCurrentSession();
      await currentSession.loadMedia(request);

      console.log('Successfully cast YouTube video:', videoId);
      return true;
    } catch (error) {
      console.error('Failed to cast video:', error);
      return false;
    }
  }

  async play(): Promise<void> {
    const session = this.castContext?.getCurrentSession();
    const media = session?.getMediaSession();
    if (media) {
      await media.play(new window.chrome.cast.media.PlayRequest());
    }
  }

  async pause(): Promise<void> {
    const session = this.castContext?.getCurrentSession();
    const media = session?.getMediaSession();
    if (media) {
      await media.pause(new window.chrome.cast.media.PauseRequest());
    }
  }

  async stop(): Promise<void> {
    const session = this.castContext?.getCurrentSession();
    if (session) {
      await session.endSession(true);
    }
  }

  isConnected(): boolean {
    const session = this.castContext?.getCurrentSession();
    return session?.getSessionState() === 'CONNECTED';
  }

  getCastState(): string {
    if (!this.castContext) return 'NOT_CONNECTED';
    return this.castContext.getCastState();
  }
}

export const castService = new CastService();
