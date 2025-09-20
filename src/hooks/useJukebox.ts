import { useState, useCallback, useEffect } from 'react';
import { Song, PlayerState, JukeboxState } from '@/types/music';
import { defaultSongs } from '@/data/defaultSongs';

export const useJukebox = () => {
  const [state, setState] = useState<JukeboxState>({
    playlist: defaultSongs,
    playerState: {
      currentSong: null,
      isPlaying: false,
      volume: 0.8,
      shuffle: false,
      repeat: 'none',
      currentTime: 0,
      duration: 0
    },
    queue: [],
    history: []
  });

  const playSong = useCallback((song: Song) => {
    setState(prev => ({
      ...prev,
      playerState: {
        ...prev.playerState,
        currentSong: song,
        isPlaying: true
      },
      history: [song, ...prev.history.slice(0, 49)] // Keep last 50
    }));
  }, []);

  const togglePlay = useCallback(() => {
    setState(prev => ({
      ...prev,
      playerState: {
        ...prev.playerState,
        isPlaying: !prev.playerState.isPlaying
      }
    }));
  }, []);

  const nextSong = useCallback(() => {
    const { playlist, playerState, queue } = state;
    if (queue.length > 0) {
      playSong(queue[0]);
      setState(prev => ({ ...prev, queue: prev.queue.slice(1) }));
    } else if (playlist.length > 0) {
      const currentIndex = playlist.findIndex(s => s.id === playerState.currentSong?.id);
      const nextIndex = (currentIndex + 1) % playlist.length;
      playSong(playlist[nextIndex]);
    }
  }, [state, playSong]);

  const addSong = useCallback((song: Song) => {
    setState(prev => ({
      ...prev,
      playlist: [...prev.playlist, song]
    }));
  }, []);

  return {
    ...state,
    playSong,
    togglePlay,
    nextSong,
    addSong
  };
};