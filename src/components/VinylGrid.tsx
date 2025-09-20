import React from 'react';
import { Song } from '@/types/music';
import VinylRecord from './VinylRecord';

interface VinylGridProps {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onSongSelect: (song: Song) => void;
}

const VinylGrid: React.FC<VinylGridProps> = ({
  songs,
  currentSong,
  isPlaying,
  onSongSelect
}) => {
  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Vinyl</span>
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 justify-items-center">
          {songs.map((song) => (
            <VinylRecord
              key={song.id}
              song={song}
              isPlaying={isPlaying}
              isCurrentSong={currentSong?.id === song.id}
              onClick={() => onSongSelect(song)}
            />
          ))}
        </div>
        
        {songs.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl">No songs in your jukebox yet.</p>
            <p className="mt-2">Add some songs to get started!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default VinylGrid;