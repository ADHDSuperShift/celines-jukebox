export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  youtubeId: string;
  albumCover: string;
  duration?: number;
  addedAt: Date;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  isDefault?: boolean;
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  currentTime: number;
  duration: number;
}

export interface JukeboxState {
  playlist: Song[];
  playerState: PlayerState;
  queue: Song[];
  history: Song[];
}