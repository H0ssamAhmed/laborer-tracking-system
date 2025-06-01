
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ConvexProvider, ConvexReactClient } from 'convex/react';
<<<<<<< HEAD
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth-context';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ConvexProvider client={convex}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ConvexProvider>
  </BrowserRouter>
=======

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
>>>>>>> 604063ccf6c83e0ab703062c919cbe8ffdbf4ca8
);
