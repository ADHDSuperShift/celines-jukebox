import { forwardRef, useImperativeHandle, useRef, useCallback } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";

export interface YouTubePlayerHandle {
  play: () => void;
  pause: () => void;
  seekTo: (s: number) => void;
  getPlayer: () => any;
}

interface Props {
  videoId: string;
  onEnded?: () => void;
  onReady?: (e: YouTubeEvent) => void;
  onPlay?: () => void;
}

const YouTubePlayer = forwardRef<YouTubePlayerHandle, Props>(
  ({ videoId, onEnded, onReady, onPlay }, ref) => {
    const playerRef = useRef<any>(null);
    const isReadyRef = useRef(false);

    const ensurePlay = useCallback(() => {
      if (playerRef.current && isReadyRef.current) {
        try {
          const playerState = playerRef.current.getPlayerState();
          if (playerState !== 1) { // Not playing
            playerRef.current.playVideo();
            console.log('Ensured playback started');
          }
        } catch (error) {
          console.warn('Ensure play failed:', error);
        }
      }
    }, []);

    useImperativeHandle(ref, () => ({
      play: () => {
        if (playerRef.current && isReadyRef.current) {
          playerRef.current.playVideo();
          // Double-check after a short delay
          setTimeout(ensurePlay, 500);
        }
      },
      pause: () => playerRef.current?.pauseVideo(),
      seekTo: (s: number) => playerRef.current?.seekTo(s, true),
      getPlayer: () => playerRef.current || null,
    }));

    const opts = {
      height: "1",
      width: "1",
      playerVars: {
        autoplay: 0, // Disable autoplay, we'll handle it manually
        controls: 0,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        enablejsapi: 1,
        mute: 0,
        start: 0,
      },
    };

    return (
      <div style={{ 
        position: "absolute", 
        left: "-9999px", 
        top: "-9999px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        visibility: "hidden"
      }}>
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={(e) => {
            playerRef.current = e.target;
            isReadyRef.current = true;
            console.log('YouTube player ready - waiting for manual play trigger');
            onReady?.(e);
          }}
          onStateChange={(e) => {
            if (e.data === 0) onEnded?.(); // ended
            if (e.data === 1) onPlay?.(); // playing
          }}
        />
      </div>
    );
  }
);

export default YouTubePlayer;

