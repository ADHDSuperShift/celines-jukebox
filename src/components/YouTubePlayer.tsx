import { forwardRef, useImperativeHandle, useRef } from "react";
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
}

const YouTubePlayer = forwardRef<YouTubePlayerHandle, Props>(
  ({ videoId, onEnded, onReady }, ref) => {
    const playerRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      play: () => playerRef.current?.playVideo(),
      pause: () => playerRef.current?.pauseVideo(),
      seekTo: (s: number) => playerRef.current?.seekTo(s, true),
      getPlayer: () => playerRef.current || null,
    }));

    const opts = {
      height: "1",
      width: "1",
      playerVars: {
        autoplay: 1,
        controls: 0,
        rel: 0,
        modestbranding: 1,
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
            onReady?.(e);
          }}
          onStateChange={(e) => {
            if (e.data === 0) onEnded?.(); // ended
          }}
        />
      </div>
    );
  }
);

export default YouTubePlayer;

