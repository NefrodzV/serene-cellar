
import React from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { RouterProvider } from 'react-router-dom'
import router from '../Router'


const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
createRoot(document.getElementById('root')).render(<React.StrictMode>
<GoogleOAuthProvider clientId={googleClientId}>
  <RouterProvider router={router} />
</GoogleOAuthProvider>
</React.StrictMode>)