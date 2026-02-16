import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import {
    CartPage,
    LoginPage,
    ProductPage,
    ShopPage,
    RegisterPage,
    CheckoutSuccessPage,
    CheckoutCancelPage,
    ProfilePage,
} from '../pages'
import { MainLayout } from '../layouts/MainLayout'
const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Navigate to={'/shop'} />,
            },
            {
                path: '/shop',
                element: <ShopPage />,
            },
            {
                path: '/shop/:id',
                element: <ProductPage />,
            },

            {
                path: '/cart',
                element: <CartPage />,
            },

            {
                path: '/checkout/success',
                element: <CheckoutSuccessPage />,
            },

            {
                path: '/checkout/cancel',
                element: <CheckoutCancelPage />,
            },
            {
                path: '/profile',
                element: <ProfilePage />,
            },

            {
                path: '/login',
                element: <LoginPage />,
            },

            {
                path: '/register',
                element: <RegisterPage />,
            },
        ],
    },
])

export default router
