import React, { useState, useRef } from 'react';
import { useJukebox } from '@/hooks/useJukebox';
import { useCast } from '@/hooks/useCast';
import JukeboxHeader from './JukeboxHeader';
import NowPlaying from './NowPlaying';
import VinylGrid from './VinylGrid';
import AddSongModal from './AddSongModal';
import YouTubePlayer, { YouTubePlayerHandle } from './YouTubePlayer';

const AppLayout: React.FC = () => {
  const {
    playlist,
    playerState,
    playSong,
    togglePlay,
    nextSong,
    addSong
  } = useJukebox();

  const [showAddModal, setShowAddModal] = useState(false);
  const playerRef = useRef<YouTubePlayerHandle>(null);
  const { isConnected, castCurrentSong, playCast, pauseCast } = useCast();

  const handleTogglePlay = () => {
    if (isConnected) {
      // Control cast device
      if (playerState.isPlaying) {
        pauseCast();
      } else {
        playCast();
      }
    } else {
      // Control local player
      if (playerState.isPlaying) {
        playerRef.current?.pause();
      } else {
        playerRef.current?.play();
      }
    }
    togglePlay();
  };

  const handlePlaySong = (song: any) => {
    playSong(song);
    
    if (isConnected) {
      // Cast to Chromecast
      castCurrentSong(song.youtubeId, song.title, song.artist, song.albumCover);
    } else {
      // Play locally
      setTimeout(() => {
        playerRef.current?.play();
      }, 200);
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
        // Pause local player when casting starts
        playerRef.current?.pause();
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
      {/* Hidden YouTube Player for Audio */}
      {playerState.currentSong && (
        <YouTubePlayer
          ref={playerRef}
          videoId={playerState.currentSong.youtubeId}
          onEnded={nextSong}
          onReady={() => {
            if (playerState.isPlaying) {
              setTimeout(() => playerRef.current?.play(), 200);
            }
          }}
        />
      )}

      {/* Header */}
      <JukeboxHeader
        onAddSong={() => setShowAddModal(true)}
        onCast={handleCast}
        isConnected={isConnected}
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