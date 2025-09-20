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
      // Use default media receiver for better compatibility
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
        await this.castContext.requestSession();
        const newSession = this.castContext.getCurrentSession();
        if (!newSession) {
          throw new Error('Failed to establish cast session');
        }
      }

      const currentSession = this.castContext.getCurrentSession();
      
      // Create a beautiful visualization page instead of trying to play audio
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title} - ${artist}</title>
          <meta charset="utf-8">
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              background: linear-gradient(45deg, #1a1a2e, #16213e, #0f3460);
              font-family: 'Arial', sans-serif;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 100vh;
              color: white;
              overflow: hidden;
            }
            .player-container {
              text-align: center;
              max-width: 800px;
              padding: 40px;
              z-index: 10;
            }
            .album-cover {
              width: 400px;
              height: 400px;
              border-radius: 50%;
              margin: 0 auto 40px;
              background: url('${albumCover}') center/cover;
              box-shadow: 0 0 80px rgba(236, 72, 153, 0.5);
              animation: spin 30s linear infinite, pulse 2s ease-in-out infinite;
              border: 4px solid rgba(236, 72, 153, 0.3);
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes pulse {
              0%, 100% { box-shadow: 0 0 80px rgba(236, 72, 153, 0.5); }
              50% { box-shadow: 0 0 120px rgba(236, 72, 153, 0.8); }
            }
            .song-title {
              font-size: 3.5em;
              margin-bottom: 20px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
              background: linear-gradient(45deg, #ec4899, #8b5cf6);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .artist-name {
              font-size: 2em;
              opacity: 0.9;
              margin-bottom: 40px;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            }
            .message {
              font-size: 1.5em;
              opacity: 0.8;
              margin-top: 30px;
              animation: fadeInOut 3s ease-in-out infinite;
            }
            @keyframes fadeInOut {
              0%, 100% { opacity: 0.8; }
              50% { opacity: 1; }
            }
            .equalizer {
              display: flex;
              justify-content: center;
              align-items: flex-end;
              height: 60px;
              margin-top: 30px;
            }
            .bar {
              width: 8px;
              margin: 0 2px;
              background: linear-gradient(to top, #ec4899, #8b5cf6);
              border-radius: 4px 4px 0 0;
            }
            .particles {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: 1;
            }
            .particle {
              position: absolute;
              background: radial-gradient(circle, rgba(236, 72, 153, 0.8), transparent);
              border-radius: 50%;
              animation: float 6s ease-in-out infinite;
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
            }
          </style>
        </head>
        <body>
          <div class="particles"></div>
          <div class="player-container">
            <div class="album-cover"></div>
            <h1 class="song-title">${title}</h1>
            <p class="artist-name">${artist}</p>
            <div class="equalizer">
              ${Array.from({length: 20}, (_, i) => `<div class="bar" style="animation-delay: ${i * 0.1}s;"></div>`).join('')}
            </div>
            <p class="message">🎵 Playing from Celine's Jukebox</p>
            <p class="message">Audio streaming from your device</p>
          </div>
          <script>
            // Create animated equalizer bars
            const bars = document.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
              setInterval(() => {
                const height = Math.random() * 60 + 10;
                bar.style.height = height + 'px';
              }, 200 + index * 50);
            });
            
            // Create floating particles
            const particlesContainer = document.querySelector('.particles');
            setInterval(() => {
              const particle = document.createElement('div');
              particle.className = 'particle';
              particle.style.left = Math.random() * 100 + '%';
              particle.style.width = Math.random() * 6 + 4 + 'px';
              particle.style.height = particle.style.width;
              particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
              particlesContainer.appendChild(particle);
              
              setTimeout(() => {
                particle.remove();
              }, 8000);
            }, 800);
          </script>
        </body>
        </html>
      `;
      
      // Create a data URL with the HTML content
      const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
      
      const mediaInfo = new window.chrome.cast.media.MediaInfo(dataUrl, 'text/html');
      
      mediaInfo.metadata = new window.chrome.cast.media.GenericMediaMetadata();
      mediaInfo.metadata.title = title;
      mediaInfo.metadata.subtitle = artist;
      
      if (albumCover) {
        mediaInfo.metadata.images = [new window.chrome.cast.Image(albumCover)];
      }

      const request = new window.chrome.cast.media.LoadRequest(mediaInfo);
      request.autoplay = true;
      
      await currentSession.loadMedia(request);
      console.log('Successfully cast music visualization for:', videoId);
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
