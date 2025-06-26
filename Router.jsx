import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage, ShopPage } from "./src/pages";
import {TwitterCallback, TwitterAuth} from "./src/components";
const router = createBrowserRouter([
    {
        path: '/',
        element : <Navigate to={'/shop'} />
    },
    {
        path: '/shop',
        element: <ShopPage />
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/twitter/callback',
        element: <TwitterCallback />
    },
    {
        path: '/twitter/auth',
        element: <TwitterAuth />
    }
])

export default router