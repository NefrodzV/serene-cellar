import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import {
  CartPage,
  LoginPage,
  ProductPage,
  ShopPage,
  RegisterPage,
  CheckoutSuccess,
  CheckoutCancel,
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
        path: '/shop/:id',
        element: <ProductPage />,
      },

      {
        path: '/cart',
        element: <CartPage />,
      },

      {
        path: '/checkout/success',
        element: <CheckoutSuccess />,
      },

      {
        path: '/checkout/cancel',
        element: <CheckoutCancel />,
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
])

export default router
