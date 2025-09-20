import React, { useState, useRef, useEffect } from 'react';
import { useJukebox } from '@/hooks/useJukebox';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer';
import { useCast } from '@/hooks/useCast';
import YouTubePlayer, { YouTubePlayerHandle } from './YouTubePlayer';
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
    currentSong,
    isPlaying: youtubeIsPlaying,
    volume,
    playSong: playYouTubeSong,
    togglePlay: toggleYouTubePlay,
    handleVolumeChange
  } = useYouTubePlayer();

  const [showAddModal, setShowAddModal] = useState(false);
  const { isConnected, castCurrentSong, playCast, pauseCast } = useCast();
  const youtubePlayerRef = useRef<YouTubePlayerHandle>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  const handleTogglePlay = () => {
    if (isConnected) {
      // Control cast device
      if (playerState.isPlaying) {
        pauseCast();
      } else {
        playCast();
      }
    } else {
      // Control YouTube player
      if (playerState.isPlaying) {
        youtubePlayerRef.current?.pause();
      } else {
        youtubePlayerRef.current?.play();
      }
    }
    togglePlay();
  };

  const enableAudio = () => {
    setUserInteracted(true);
  };

  const handlePlaySong = (song: any) => {
    console.log("Playing song:", song.title);
    
    if (!userInteracted) {
      alert('Please click anywhere to enable audio playback');
      return;
    }
    
    // Set the song in jukebox state
    playSong(song);
    playYouTubeSong(song);
    
    // If connected, also cast the song
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

  const handlePrevious = () => {
    // Previous song functionality would be implemented here
    console.log('Previous song');
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900"
      onClick={enableAudio}
    >
      {/* User Interaction Banner */}
      {!userInteracted && (
        <div className="bg-blue-600 text-white p-4 text-center">
          <p className="mb-2">Click anywhere to enable audio playback</p>
        </div>
      )}

      {/* Header */}
      <JukeboxHeader
        onAddSong={() => setShowAddModal(true)}
        onCast={handleCast}
        isConnected={isConnected}
        spotifyAuthenticated={false}
        onSpotifyLogout={() => {}}
      />

      {/* YouTube Player (hidden) */}
      {playerState.currentSong && (
        <YouTubePlayer
          key={playerState.currentSong.youtubeId}
          ref={youtubePlayerRef}
          videoId={playerState.currentSong.youtubeId}
          onEnded={nextSong}
          onReady={() => console.log('YouTube player ready')}
          onPlay={() => console.log('YouTube playing')}
        />
      )}

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