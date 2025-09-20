import { useMemo, useRef, useState, useCallback } from "react";
import YouTubePlayer from "./YouTubePlayer";
import { extractYouTubeId } from "../utils/extractYouTubeId";

// 👉 Replace these with your 20 YouTube links or IDs
const STARTER_TRACKS = [
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "https://youtu.be/3JZ_D3ELwOQ",
  "9bZkp7q19f0",
];

export default function Jukebox() {
  const [playlist] = useState(
    STARTER_TRACKS
      .map(extractYouTubeId)
      .filter(Boolean)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const playerRef = useRef(null);

  const currentVideoId = useMemo(
    () => (playlist.length ? playlist[currentIndex] : null),
    [playlist, currentIndex]
  );

  const next = useCallback(() => {
    if (!playlist.length) return;
    setCurrentIndex((i) => (i + 1) % playlist.length);
    setIsPlaying(true);
  }, [playlist.length]);

  const prev = useCallback(() => {
    if (!playlist.length) return;
    setCurrentIndex((i) => (i - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  }, [playlist.length]);

  const togglePlay = useCallback(() => {
    const player = playerRef.current?.getPlayer?.();
    if (!player) return;

    // Try to infer current state; if paused, play; else pause
    // (You can store state from onStateChange if you prefer.)
    if (isPlaying) {
      player.pauseVideo?.();
      setIsPlaying(false);
    } else {
      player.playVideo?.();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold">Celine&apos;s Jukebox</h1>

      {/* Invisible backend player */}
      {currentVideoId && (
        <YouTubePlayer
          ref={playerRef}
          videoId={currentVideoId}
          onEnded={next}
          onReady={() => setIsPlaying(true)}
        />
      )}

      {/* Temporary bare controls (vinyl UI comes later) */}
      <div className="flex items-center gap-4">
        <button
          onClick={prev}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          ◀ Prev
        </button>
        <button
          onClick={togglePlay}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          {isPlaying ? "Pause ⏸" : "Play ▶"}
        </button>
        <button
          onClick={next}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Next ▶
        </button>
      </div>

      {/* Show which track is active for now */}
      <div className="text-sm text-gray-600">
        Now playing ID: <code>{currentVideoId || "—"}</code>
      </div>
    </div>
  );
}
