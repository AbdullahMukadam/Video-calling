import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import UserContextProvider from './Context/userContextProvider.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import CallContextProvider from './Context/callContextProvider.tsx'

createRoot(document.getElementById('root')!).render(

  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <CallContextProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </CallContextProvider>
  </GoogleOAuthProvider>


)
