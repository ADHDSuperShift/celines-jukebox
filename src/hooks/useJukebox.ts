import { useState, useCallback, useEffect } from 'react';
import { Song, PlayerState, JukeboxState } from '@/types/music';
import { defaultSongs } from '@/data/defaultSongs';
import { validateAlbumCoverUrl } from '@/utils/security';

// Load saved songs from localStorage with security validation
const loadSavedSongs = (): Song[] => {
  try {
    const saved = localStorage.getItem('celines-jukebox-songs');
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Validate the parsed data
      if (Array.isArray(parsed)) {
        const validSongs = parsed.filter((song: any) => {
          return (
            song &&
            typeof song.id === 'string' &&
            typeof song.title === 'string' &&
            typeof song.artist === 'string' &&
            typeof song.youtubeId === 'string' &&
            /^[a-zA-Z0-9_-]{11}$/.test(song.youtubeId) && // Validate YouTube ID format
            (!song.albumCover || validateAlbumCoverUrl(song.albumCover)) // Validate album cover URL
          );
        });
        
        return validSongs.length > 0 ? validSongs : defaultSongs;
      }
    }
  } catch (error) {
    console.error('Error loading saved songs:', error);
    // Clear potentially corrupted data
    localStorage.removeItem('celines-jukebox-songs');
  }
  return defaultSongs;
};

// Save songs to localStorage with error handling
const saveSongs = (songs: Song[]) => {
  try {
    // Limit the number of songs to prevent localStorage overflow
    const maxSongs = 100;
    const songsToSave = songs.slice(0, maxSongs);
    
    localStorage.setItem('celines-jukebox-songs', JSON.stringify(songsToSave));
  } catch (error) {
    console.error('Error saving songs:', error);
    // If storage is full, try to save just the default songs
    try {
      localStorage.setItem('celines-jukebox-songs', JSON.stringify(defaultSongs));
    } catch (fallbackError) {
      console.error('Critical storage error:', fallbackError);
    }
  }
};

export const useJukebox = () => {
  const [state, setState] = useState<JukeboxState>({
    playlist: loadSavedSongs(),
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

  // Save playlist to localStorage whenever it changes
  useEffect(() => {
    saveSongs(state.playlist);
  }, [state.playlist]);

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