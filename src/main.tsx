import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

// Workaround for libraries that try to patch fetch on Window which might have it as read-only
if (typeof window !== 'undefined' && !('global' in window)) {
  // Use a proxy to ignore attempts to overwrite read-only properties like fetch
  (window as any).global = new Proxy(window, {
    set(target, prop, value) {
      if (prop === 'fetch') return true; 
      try {
        (target as any)[prop] = value;
      } catch (e) {
        console.warn(`Could not set global property: ${String(prop)}`, e);
      }
      return true;
    }
  });
}

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
