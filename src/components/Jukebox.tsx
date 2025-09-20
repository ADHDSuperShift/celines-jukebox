import { useState, useRef, useMemo } from "react";
import YouTubePlayer, { YouTubePlayerHandle } from "./YouTubePlayer";
import { extractYouTubeId } from "../utils/utils/extractYouTubeId";

// Replace with your real 20 YouTube IDs/links
const TRACKS = [
  "dQw4w9WgXcQ",
  "3JZ_D3ELwOQ",
  "9bZkp7q19f0",
];

export default function Jukebox() {
  const [playlist] = useState(TRACKS.map(extractYouTubeId).filter(Boolean) as string[]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<YouTubePlayerHandle>(null);

  const currentVideoId = useMemo(
    () => playlist[currentIndex],
    [playlist, currentIndex]
  );

  const playTrack = (i: number) => {
    setCurrentIndex(i);
    setIsPlaying(true);
    setTimeout(() => playerRef.current?.play(), 200); // slight delay so video loads
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      playerRef.current?.pause();
      setIsPlaying(false);
    } else {
      playerRef.current?.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Invisible YouTube engine */}
      {currentVideoId && (
        <YouTubePlayer
          ref={playerRef}
          videoId={currentVideoId}
          onEnded={() => setCurrentIndex((i) => (i + 1) % playlist.length)}
        />
      )}

      {/* Vinyl record buttons */}
      <div className="grid grid-cols-3 gap-6">
        {playlist.map((id, i) => (
          <button
            key={i}
            onClick={() => playTrack(i)}
            className={`relative w-32 h-32 rounded-full border-8 border-black 
                        bg-gradient-to-r from-gray-900 to-black 
                        shadow-lg flex items-center justify-center 
                        hover:scale-105 transition-transform
                        ${i === currentIndex && isPlaying ? "animate-spin-slow" : ""}`}
          >
            {/* Album art in the center (using YouTube thumbnail as fake "label") */}
            <img
              src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
              alt="album cover"
              className="w-16 h-16 rounded-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main controls */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() =>
            setCurrentIndex((i) => (i - 1 + playlist.length) % playlist.length)
          }
          className="px-4 py-2 bg-gray-200 rounded"
        >
          ◀ Prev
        </button>
        <button
          onClick={togglePlayPause}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          {isPlaying ? "Pause ⏸" : "Play ▶"}
        </button>
        <button
          onClick={() => setCurrentIndex((i) => (i + 1) % playlist.length)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
