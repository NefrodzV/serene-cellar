import React, { useEffect, useRef, useState } from 'react'
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom'
import { useCart, useUser } from '../hooks'
import { MessageContainer } from '../components/messages/MessageContainer'
import logo from '../assets/logo-bg.png'
import { Button } from '../components/ui/Button'
import { Drawer } from '../components'
export function MainLayout() {
  const { cart } = useCart()
  const { isAuthenticated, user } = useUser()

  return (
    <div className="app-layout">
      <header className="header">
        <div className="content">
          <svg
            aria-label="Serene Cellar"
            className="logo"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="32" cy="32" r="28" />
              <path d="M22 20c0 7 5.5 12 10 12s10-5 10-12H22z" />
              <path
                d="M24 22c2.5 3 6 5 8 5s5.5-2 8-5"
                fill="currentColor"
                stroke="none"
                opacity=".9"
              />
              <path d="M32 32v12" />
              <path d="M24 48h16" />
            </g>
          </svg>

          <Drawer
            navItems={[
              {
                link: '/shop',
                text: 'shop',
                icon: <i className="fa-solid fa-wine-glass icon"></i>,
              },
              {
                link: isAuthenticated ? '#' : '/login',
                text: isAuthenticated ? 'profile' : 'login',
                icon: <i className="fa-solid fa-user"></i>,
              },
              {
                link: '/cart',
                text: cart?.totalItems ? `cart(${cart?.totalItems})` : 'cart',
                icon: <i className="cart fa-solid fa-cart-shopping"></i>,
              },
            ]}
          />
        </div>
      </header>
      <main className={`main-layout center-vertically`}>
        <Outlet />
        <MessageContainer />
      </main>
      <footer className="footer">Footer</footer>
    </div>
  )
}
