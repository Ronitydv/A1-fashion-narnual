import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn("⚠️ Clerk Publishable Key (VITE_CLERK_PUBLISHABLE_KEY) is missing. Set it in your .env file.");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    ) : (
      <div style={{ padding: '40px', textAlign: 'center', background: '#ffeef0', color: '#ff4d4f', fontFamily: 'sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h2>Missing Clerk Publishable Key</h2>
        <p>Please add <code>VITE_CLERK_PUBLISHABLE_KEY</code> to your local <code>.env</code> file in the root folder of the project.</p>
        <p>Example: <code>VITE_CLERK_PUBLISHABLE_KEY=pk_test_...</code></p>
      </div>
    )}
  </StrictMode>,
)
