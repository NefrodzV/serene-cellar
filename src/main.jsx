
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import Login from './pages/Login.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
createRoot(document.getElementById('root')).render(<React.StrictMode>
<GoogleOAuthProvider clientId={googleClientId}>
  <Login />
</GoogleOAuthProvider>
</React.StrictMode>)