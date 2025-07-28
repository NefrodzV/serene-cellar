import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import {
  CartPage,
  LoginPage,
  ProductPage,
  ShopPage,
  RegisterPage,
} from '../pages'
import { TwitterCallback, TwitterAuth } from '../components'
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
        path: '/shop/:slug',
        element: <ProductPage />,
      },

      {
        path: '/cart',
        element: <CartPage />,
      },
    ],
  },

  {
    path: '/login',
    element: <LoginPage />,
  },

  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/twitter/callback',
    element: <TwitterCallback />,
  },
  {
    path: '/twitter/auth',
    element: <TwitterAuth />,
  },
])

export default router
