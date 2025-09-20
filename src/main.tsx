
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add error handling
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

// Security: Prevent console access in production
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/celines-jukebox/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Simple error boundary component
function ErrorFallback() {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      background: '#1a1a2e', 
      color: 'white', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1>🎵 Celine's Jukebox</h1>
      <p>Loading your music experience...</p>
    </div>
  );
}

// Render with error boundary
try {
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
} catch (error) {
  console.error('Failed to render app:', error);
  document.getElementById("root")!.innerHTML = `
    <div style="padding: 20px; text-align: center; background: #1a1a2e; color: white; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <h1>🎵 Celine's Jukebox</h1>
      <p>Having trouble loading. Please refresh the page.</p>
    </div>
  `;
}
