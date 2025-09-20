
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Security: Prevent console access in production
if (import.meta.env.MODE === 'production') {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Remove dark mode class addition
createRoot(document.getElementById("root")!).render(<App />);
