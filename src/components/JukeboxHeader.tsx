import React from 'react';
import { Music, Plus, Cast } from 'lucide-react';

interface JukeboxHeaderProps {
  onAddSong: () => void;
  onCast: () => void;
  isConnected?: boolean;
}

const JukeboxHeader: React.FC<JukeboxHeaderProps> = ({ onAddSong, onCast, isConnected = false }) => {
  return (
    <header className="relative overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://d64gsuwffb70l.cloudfront.net/68ce46f09438f395da86302f_1758349075493_57d8ffa2.webp)'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 px-6 py-12 text-center">
        {/* Neon title */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-pulse">
            Celine's
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mt-2">
            JUKEBOX
          </h2>
        </div>
        
        {/* Subtitle */}
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Step into the golden age of music with your retro jukebox experience. 
          Select your favorite vinyl records and let the magic begin!
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onAddSong}
            className="flex items-center space-x-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-pink-500/25"
          >
            <Plus className="w-5 h-5" />
            <span>Add Song</span>
          </button>
          
          <button
            onClick={onCast}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
              isConnected 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
          >
            <Cast className="w-5 h-5" />
            <span>{isConnected ? 'Connected to TV' : 'Cast to TV'}</span>
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 left-4 w-8 h-8 bg-pink-500 rounded-full animate-ping opacity-75"></div>
        <div className="absolute top-8 right-8 w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 left-8 w-4 h-4 bg-yellow-500 rounded-full animate-bounce"></div>
        <div className="absolute bottom-8 right-4 w-10 h-10 bg-purple-500 rounded-full animate-pulse opacity-50"></div>
      </div>
    </header>
  );
};

export default JukeboxHeader;