import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "./src/pages";
import {TwitterCallback, TwitterAuth} from "./src/components";
const router = createBrowserRouter([
    {
        path: '/',
        element : <Navigate to={'/login'} />
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