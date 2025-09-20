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
  const [showTapToPlay, setShowTapToPlay] = useState(false);
  const [pendingSong, setPendingSong] = useState<any>(null);
  const [playerReady, setPlayerReady] = useState(false);

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

  const enableAudio = async () => {
    setUserInteracted(true);
    
    // Try to unlock audio context for mobile
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
        console.log('Audio context unlocked for mobile');
      }
    } catch (error) {
      console.log('Audio context unlock not needed or failed:', error);
    }
  };

  const handlePlaySong = (song: any) => {
    console.log("Playing song:", song.title);
    
    if (!userInteracted) {
      alert('Please click anywhere to enable audio playback');
      return;
    }
    
    // On mobile, show tap to play overlay instead of auto-playing
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      setPendingSong(song);
      setShowTapToPlay(true);
      setPlayerReady(false); // reset until player is ready
      playSong(song);
      playYouTubeSong(song);
      return;
    }
    
    // Desktop: play immediately
    playSong(song);
    playYouTubeSong(song);
    
    // Trigger YouTube player to play on desktop with multiple attempts
    const tryPlay = () => {
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.play();
        console.log('Desktop autoplay attempt');
      }
    };
    
    // Try immediately, then after 500ms, then after 1.5s
    tryPlay();
    setTimeout(tryPlay, 500);
    setTimeout(tryPlay, 1500);
    
    // If connected, also cast the song
    if (isConnected && song.youtubeId) {
      castCurrentSong(song.youtubeId, song.title, song.artist, song.albumCover);
    }
  };

  const handleTapToPlay = () => {
    if (pendingSong && youtubePlayerRef.current) {
      console.log('User tapped to play:', pendingSong.title);
      youtubePlayerRef.current.play();
      setShowTapToPlay(false);
      setPendingSong(null);
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
          onReady={() => {
            console.log('YouTube player ready');
            setPlayerReady(true);
          }}
          onPlay={() => console.log('YouTube playing')}
        />
      )}

      {/* Tap to Play Overlay for Mobile */}
      {showTapToPlay && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center max-w-sm mx-4">
            <div className="text-6xl mb-4">🎵</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tap to Play</h2>
            <p className="text-gray-600 mb-6">
              {pendingSong?.title} by {pendingSong?.artist}
            </p>
            <button
              onClick={handleTapToPlay}
              disabled={!playerReady}
              className={`font-bold py-3 px-8 rounded-lg text-lg transition-colors ${playerReady ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              {playerReady ? '▶️ Play Now' : 'Loading player…'}
            </button>
          </div>
        </div>
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