import React from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { RouterProvider } from 'react-router-dom'
import router from './router/Router'
import { UserProvider } from './contexts/UserContext'
import { CartProvider } from './contexts/CartContext'
import { MessageProvider } from './contexts/MessageContext'
import './style.css'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MessageProvider>
      <UserProvider>
        <CartProvider>
          <GoogleOAuthProvider clientId={googleClientId}>
            <RouterProvider router={router} />
          </GoogleOAuthProvider>
        </CartProvider>
      </UserProvider>
    </MessageProvider>
  </React.StrictMode>
)
