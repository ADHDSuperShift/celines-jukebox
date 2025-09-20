import { useState, useEffect } from 'react';
import { castService } from '@/services/castService';

export const useCast = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [castState, setCastState] = useState('NOT_CONNECTED');

  useEffect(() => {
    const initializeCast = async () => {
      const initialized = await castService.initialize();
      setIsInitialized(initialized);
      
      if (initialized) {
        // Poll cast state periodically
        const interval = setInterval(() => {
          const connected = castService.isConnected();
          const state = castService.getCastState();
          setIsConnected(connected);
          setCastState(state);
        }, 1000);

        return () => clearInterval(interval);
      }
    };

    initializeCast();
  }, []);

  const castCurrentSong = async (videoId: string, title: string, artist: string, albumCover: string) => {
    try {
      const success = await castService.castYouTubeVideo(videoId, title, artist, albumCover);
      if (success) {
        console.log('Successfully started casting');
      } else {
        console.error('Failed to start casting');
      }
      return success;
    } catch (error) {
      console.error('Cast error:', error);
      return false;
    }
  };

  const playCast = async () => {
    try {
      await castService.play();
    } catch (error) {
      console.error('Failed to play on cast device:', error);
    }
  };

  const pauseCast = async () => {
    try {
      await castService.pause();
    } catch (error) {
      console.error('Failed to pause on cast device:', error);
    }
  };

  const stopCast = async () => {
    try {
      await castService.stop();
      setIsConnected(false);
    } catch (error) {
      console.error('Failed to stop casting:', error);
    }
  };

  return {
    isInitialized,
    isConnected,
    castState,
    castCurrentSong,
    playCast,
    pauseCast,
    stopCast
  };
};
