# 🎵 Celine's Jukebox

A stunning retro jukebox web application built with React, Vite, and Tailwind CSS. Experience the golden age of music with authentic vinyl record aesthetics, smooth animations, and modern web technologies.

## ✨ Features

### 🎨 Retro Design
- **Vinyl Record Interface**: Songs displayed as interactive vinyl records with album art centers
- **Neon Aesthetics**: Glowing lights, pulsing animations, and retro color schemes
- **Smooth Animations**: Spinning records, hover effects, and ambient lighting
- **Mobile-First**: Responsive design that works beautifully on all devices

### 🎵 Music Experience
- **YouTube Integration**: Play any YouTube song with full player controls
- **Rich Controls**: Play, pause, skip, shuffle, repeat, and volume control
- **Now Playing**: Large spinning vinyl display with song information
- **Queue Management**: Add songs to queue and manage playback history

### 📱 Modern Web App
- **PWA Ready**: Installable as a Progressive Web App
- **Cast Support**: Ready for Chromecast/AirPlay integration
- **Offline Capable**: Service worker ready for offline functionality
- **Fast Loading**: Optimized with Vite for lightning-fast development and builds

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd celinas-jukebox
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast builds and HMR
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Project Structure
```
src/
├── components/          # React components
│   ├── AppLayout.tsx   # Main app layout
│   ├── VinylRecord.tsx # Vinyl record component
│   ├── NowPlaying.tsx  # Now playing section
│   └── ...
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── data/               # Static data and configurations
├── utils/              # Utility functions
└── styles/             # Global styles
```

## 🎵 Adding Songs

### Via UI
1. Click the "Add Song" button in the header
2. Paste a YouTube URL
3. Enter song title, artist, and album
4. Click "Add Song" to add to your jukebox

### Programmatically
Add songs to `src/data/defaultSongs.ts`:

```typescript
{
  id: 'unique-id',
  title: 'Song Title',
  artist: 'Artist Name',
  album: 'Album Name',
  youtubeId: 'YouTube-Video-ID',
  albumCover: 'https://path-to-album-cover.jpg',
  duration: 240, // in seconds
  addedAt: new Date()
}
```

## 🔧 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update color schemes in component files
- Add custom animations in CSS

### Features
- Extend `useJukebox` hook for additional functionality
- Add new components in `src/components/`
- Implement backend integration in `src/services/`

## 📱 PWA Installation

The app can be installed as a PWA on supported devices:

1. **Desktop**: Look for the install icon in your browser's address bar
2. **Mobile**: Use "Add to Home Screen" from your browser menu
3. **Features**: Offline access, full-screen experience, app-like behavior

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Retro jukebox UI with vinyl records
- ✅ YouTube player integration
- ✅ Song management system
- ✅ PWA capabilities

### Phase 2 (Planned)
- 🔄 AWS Backend Integration (Lambda + DynamoDB)
- 🔄 Real Chromecast/AirPlay support
- 🔄 User accounts and playlists
- 🔄 Social features and sharing

### Phase 3 (Future)
- 📋 Advanced queue management
- 📋 Music discovery features
- 📋 Collaborative playlists
- 📋 Analytics and insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by classic jukebox designs from the 1950s-60s
- Built with modern web technologies for the best user experience
- Special thanks to the open-source community for amazing tools and libraries

---

**Made with ❤️ and a love for great music**