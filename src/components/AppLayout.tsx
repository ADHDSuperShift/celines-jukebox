import React, { useState, useRef, useEffect } from 'react';
import { useJukebox } from '@/hooks/useJukebox';
import { useSpotify } from '@/hooks/useSpotify';
import { useCast } from '@/hooks/useCast';
import JukeboxHeader from './JukeboxHeader';
import NowPlaying from './NowPlaying';
import VinylGrid from './VinylGrid';
import AddSongModal from './AddSongModal';

const AppLayout: React.FC = () => {
  const {
    playlist,
    playerState,
    playSong,
    togglePlay,
    nextSong,
    addSong
  } = useJukebox();

  const {
    isAuthenticated,
    isPlayerReady,
    currentTrack,
    isPlaying: spotifyIsPlaying,
    isInitializing,
    login,
    logout,
    playTrack,
    pause,
    resume
  } = useSpotify();

  const [showAddModal, setShowAddModal] = useState(false);
  const { isConnected, castCurrentSong, playCast, pauseCast } = useCast();

  const handleTogglePlay = () => {
    if (isConnected) {
      // Control cast device
      if (playerState.isPlaying) {
        pauseCast();
      } else {
        playCast();
      }
    } else if (isAuthenticated) {
      // Control Spotify player
      if (spotifyIsPlaying) {
        pause();
      } else {
        resume();
      }
    }
    togglePlay();
  };

  const handlePlaySong = (song: any) => {
    console.log("Playing song:", song.title);
    
    // Try Spotify first, fallback to YouTube
    if (isAuthenticated && song.spotifyId) {
      const startSpotifyPlayback = async () => {
        playSong(song);
        try {
          const success = await playTrack(`spotify:track:${song.spotifyId}`);
          if (!success) {
            console.error('Failed to play track on Spotify, falling back to YouTube');
            // Could fallback to YouTube here
          }
        } catch (error) {
          console.error('Error playing track:', error);
        }
      };
      startSpotifyPlayback();
    } else {
      // Fallback: Alert user to setup Spotify or use YouTube
      alert('Please login to Spotify first, or YouTube integration coming soon!');
    }
    
    // If connected, also cast the visualization
    if (isConnected && song.youtubeId) {
      castCurrentSong(song.youtubeId, song.title, song.artist, song.albumCover);
    }
  };

  const handleCast = async () => {
    if (playerState.currentSong) {
      const success = await castCurrentSong(
        playerState.currentSong.youtubeId,
        playerState.currentSong.title,
        playerState.currentSong.artist,
        playerState.currentSong.albumCover
      );
      
      if (success) {
        // Keep local player running - we're only casting the visualization
        console.log('Cast visualization started, audio continues locally');
      }
    } else {
      alert('Please select a song first before casting');
    }
  };


  const handleToggleShuffle = () => {
    // Shuffle functionality would be implemented here
    console.log('Toggle shuffle');
  };

  const handleToggleRepeat = () => {
    // Repeat functionality would be implemented here
    console.log('Toggle repeat');
  };

  const handleVolumeChange = (volume: number) => {
    // Volume change functionality would be implemented here
    console.log('Volume changed to:', volume);
  };

  const handlePrevious = () => {
    // Previous song functionality would be implemented here
    console.log('Previous song');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Spotify Authentication Banner */}
      {!isAuthenticated && (
        <div className="bg-green-600 text-white p-4 text-center">
          <p className="mb-2">Connect to Spotify to play music</p>
          <button
            onClick={login}
            className="bg-green-800 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold transition-colors"
            disabled={isInitializing}
          >
            {isInitializing ? 'Connecting...' : 'Login to Spotify'}
          </button>
        </div>
      )}

      {/* Header */}
      <JukeboxHeader
        onAddSong={() => setShowAddModal(true)}
        onCast={handleCast}
        isConnected={isConnected}
        spotifyAuthenticated={isAuthenticated}
        onSpotifyLogout={logout}
      />

      {/* Now Playing Section */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <NowPlaying
            playerState={playerState}
            onTogglePlay={handleTogglePlay}
            onNext={nextSong}
            onPrevious={handlePrevious}
            onToggleShuffle={handleToggleShuffle}
            onToggleRepeat={handleToggleRepeat}
            onVolumeChange={handleVolumeChange}
          />
        </div>
      </div>

      {/* Vinyl Records Grid */}
      <VinylGrid
        songs={playlist}
        currentSong={playerState.currentSong}
        isPlaying={playerState.isPlaying}
        onSongSelect={handlePlaySong}
      />

      {/* Add Song Modal */}
      <AddSongModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddSong={addSong}
      />

      {/* Footer */}
      <footer className="bg-black bg-opacity-50 py-8 px-6 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 Celine's Jukebox. Bringing the golden age of music to your fingertips.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Built by Oom Dirk with React, Vite, and a love for great music.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;