import { useState, useCallback, useEffect } from 'react';
import { Song } from '@/types/music';

export const useYouTubePlayer = () => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playSong = useCallback((song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  }, []);

  const handlePlayerReady = useCallback(() => {
    console.log('YouTube player ready');
  }, []);

  const handleStateChange = useCallback((state: number) => {
    // YouTube player states:
    // -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
    switch (state) {
      case 1: // playing
        setIsPlaying(true);
        break;
      case 2: // paused
        setIsPlaying(false);
        break;
      case 0: // ended
        setIsPlaying(false);
        // Auto-play next song could be implemented here
        break;
    }
  }, []);

  const handlePlayerError = useCallback((error: number) => {
    console.error('YouTube player error:', error);
    setIsPlaying(false);
  }, []);

  return {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    playSong,
    togglePlay,
    handleVolumeChange,
    handlePlayerReady,
    handleStateChange,
    handlePlayerError
  };
};