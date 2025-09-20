import React, { useState } from 'react';
import { useJukebox } from '@/hooks/useJukebox';
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

  const [showAddModal, setShowAddModal] = useState(false);

  const handleCast = () => {
    // Cast functionality would be implemented here
    alert('Cast to TV functionality would be implemented with Chromecast SDK');
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
      {/* Header */}
      <JukeboxHeader
        onAddSong={() => setShowAddModal(true)}
        onCast={handleCast}
      />

      {/* Now Playing Section */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <NowPlaying
            playerState={playerState}
            onTogglePlay={togglePlay}
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
        onSongSelect={playSong}
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
            © 2024 Celine's Jukebox. Bringing the golden age of music to your fingertips.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Built with React, Vite, and a love for great music.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;