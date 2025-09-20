import React from 'react';
import { Song } from '@/types/music';
import { Play, Pause } from 'lucide-react';

interface VinylRecordProps {
  song: Song;
  isPlaying: boolean;
  isCurrentSong: boolean;
  onClick: () => void;
}

const VinylRecord: React.FC<VinylRecordProps> = ({
  song,
  isPlaying,
  isCurrentSong,
  onClick
}) => {
  return (
    <div 
      className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
      onClick={onClick}
    >
      {/* Vinyl Record */}
      <div className={`
        relative w-32 h-32 rounded-full bg-black border-4 border-gray-800
        ${isCurrentSong && isPlaying ? 'animate-spin' : ''}
        ${isCurrentSong ? 'ring-4 ring-pink-500 ring-opacity-50' : ''}
        transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-pink-500/30
      `}>
        {/* Outer ring */}
        <div className="absolute inset-2 rounded-full border border-gray-700"></div>
        
        {/* Album cover in center */}
        <div className="absolute inset-8 rounded-full overflow-hidden">
          <img 
            src={song.albumCover} 
            alt={`${song.title} album cover`}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Center hole */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-900 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        
        {/* Play/Pause overlay */}
        <div className={`
          absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center
          transition-opacity duration-300
          ${isCurrentSong ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}>
          {isCurrentSong && isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white ml-1" />
          )}
        </div>
      </div>
      
      {/* Song info */}
      <div className="mt-3 text-center">
        <h3 className="text-white font-semibold text-sm truncate">{song.title}</h3>
        <p className="text-gray-400 text-xs truncate">{song.artist}</p>
      </div>
    </div>
  );
};

export default VinylRecord;