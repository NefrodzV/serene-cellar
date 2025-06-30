import React from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { RouterProvider } from 'react-router-dom'
import router from '../Router'
import { UserProvider } from './contexts/UserContext'
import { CartProvider } from './contexts/CartContext'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <UserProvider>
            <CartProvider>
                <GoogleOAuthProvider clientId={googleClientId}>
                    <RouterProvider router={router} />
                </GoogleOAuthProvider>
            </CartProvider>
        </UserProvider>
    </React.StrictMode>
)
