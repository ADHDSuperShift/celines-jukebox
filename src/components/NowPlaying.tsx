import React from 'react';
import { Song, PlayerState } from '@/types/music';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2 } from 'lucide-react';

interface NowPlayingProps {
  playerState: PlayerState;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onVolumeChange: (volume: number) => void;
}

const NowPlaying: React.FC<NowPlayingProps> = ({
  playerState,
  onTogglePlay,
  onNext,
  onPrevious,
  onToggleShuffle,
  onToggleRepeat,
  onVolumeChange
}) => {
  const { currentSong, isPlaying, volume, shuffle, repeat } = playerState;

  if (!currentSong) {
    return (
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-lg p-6">
        <div className="text-center text-gray-400">
          <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Play className="w-8 h-8" />
          </div>
          <p>Select a song to start playing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-lg p-6">
      <div className="flex items-center space-x-6">
        {/* Large spinning vinyl */}
        <div className={`
          relative w-24 h-24 rounded-full bg-black border-4 border-gray-800
          ${isPlaying ? 'animate-spin' : ''}
          transition-all duration-300
        `}>
          <div className="absolute inset-2 rounded-full border border-gray-700"></div>
          <div className="absolute inset-6 rounded-full overflow-hidden">
            <img 
              src={currentSong.albumCover} 
              alt={`${currentSong.title} album cover`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-900 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* Song info and controls */}
        <div className="flex-1">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">{currentSong.title}</h2>
            <p className="text-gray-300">{currentSong.artist}</p>
            {currentSong.album && (
              <p className="text-gray-400 text-sm">{currentSong.album}</p>
            )}
          </div>
          
          {/* Control buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleShuffle}
              className={`p-2 rounded-full transition-colors ${
                shuffle ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>
            
            <button
              onClick={onPrevious}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button
              onClick={onTogglePlay}
              className="p-3 bg-pink-600 hover:bg-pink-700 rounded-full text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>
            
            <button
              onClick={onNext}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            
            <button
              onClick={onToggleRepeat}
              className={`p-2 rounded-full transition-colors ${
                repeat !== 'none' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Repeat className="w-4 h-4" />
            </button>
            
            {/* Volume control */}
            <div className="flex items-center space-x-2 ml-4">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-20 accent-pink-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;