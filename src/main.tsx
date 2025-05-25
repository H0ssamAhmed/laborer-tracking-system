
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ConvexProvider, ConvexReactClient } from 'convex/react';

// Get the Convex URL from environment variables with a fallback
const convexUrl = import.meta.env.VITE_CONVEX_URL;

// Only initialize Convex if we have a URL
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

createRoot(document.getElementById("root")!).render(
  convexUrl ? (
    <ConvexProvider client={convex!}>
      <App />
    </ConvexProvider>
  ) : (
    <App />
  )
);
