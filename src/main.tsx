import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker } from './utils/registerServiceWorker'
import { webVitals } from './utils/webVitals'

// Register service worker for caching in production
if (import.meta.env.PROD) {
  registerServiceWorker();
}

// Track web vitals for performance monitoring
webVitals({ debug: import.meta.env.DEV });

createRoot(document.getElementById("root")!).render(<App />);
