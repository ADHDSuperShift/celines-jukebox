import React, { useState } from 'react';
import { X, Plus, Music } from 'lucide-react';
import { Song } from '@/types/music';
import { validateYouTubeUrl, sanitizeText, validateAlbumCoverUrl, rateLimiter } from '@/utils/security';

interface AddSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSong: (song: Song) => void;
}

const AddSongModal: React.FC<AddSongModalProps> = ({ isOpen, onClose, onAddSong }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    if (!rateLimiter.canPerformOperation()) {
      alert('Too many requests. Please wait a moment before adding another song.');
      return;
    }
    
    // Sanitize inputs
    const sanitizedTitle = sanitizeText(title, 100);
    const sanitizedArtist = sanitizeText(artist, 100);
    const sanitizedAlbum = sanitizeText(album, 100);
    
    if (!youtubeUrl || !sanitizedTitle || !sanitizedArtist) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    
    // Enhanced YouTube URL validation
    const validation = validateYouTubeUrl(youtubeUrl);
    if (!validation.isValid || !validation.videoId) {
      alert('Please enter a valid YouTube URL');
      setIsLoading(false);
      return;
    }

    // Validate album cover URL
    const albumCoverUrl = `https://img.youtube.com/vi/${validation.videoId}/maxresdefault.jpg`;
    if (!validateAlbumCoverUrl(albumCoverUrl)) {
      alert('Invalid album cover source');
      setIsLoading(false);
      return;
    }

    // Create new song with sanitized data
    const newSong: Song = {
      id: `song_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // More secure ID
      title: sanitizedTitle,
      artist: sanitizedArtist,
      album: sanitizedAlbum || undefined,
      youtubeId: validation.videoId,
      albumCover: albumCoverUrl,
      addedAt: new Date()
    };

    try {
      onAddSong(newSong);
      
      // Reset form
      setYoutubeUrl('');
      setTitle('');
      setArtist('');
      setAlbum('');
      setIsLoading(false);
      onClose();
    } catch (error) {
      console.error('Error adding song:', error);
      alert('Failed to add song. Please try again.');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Music className="w-6 h-6 mr-2 text-pink-500" />
            Add New Song
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              YouTube URL
            </label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Song Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter song title"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Artist
            </label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Enter artist name"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Album (Optional)
            </label>
            <input
              type="text"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              placeholder="Enter album name"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-md transition-all duration-300 flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Song
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSongModal;