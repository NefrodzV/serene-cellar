import React, { useEffect, useRef, useState } from 'react'
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom'
import { useCart, useUser } from '../hooks'
import { MessageContainer } from '../components/messages/MessageContainer'
import logo from '../assets/logo-bg.png'
import { Button } from '../components/elements/Button'
export function MainLayout() {
  const { cart } = useCart()
  const { isAuthenticated, user } = useUser()

  const mql = window.matchMedia('(min-width: 600px)')
  const smql = window.matchMedia('(max-width: 600px)')
  const drawerRef = useRef(null)
  let timer
  const [isOpen, setOpen] = useState(() => {
    const isBigScreen = mql.matches
    const isSmallScreen = smql.matches
    if (isBigScreen) return true
    if (isSmallScreen) return false
  })
  useEffect(() => {
    mql.addEventListener('change', handleMediaQueryChange)
    smql.addEventListener('change', handleSmallScreenMediaQueryChange)
    return () => {
      mql.removeEventListener('change', handleMediaQueryChange)
      smql.removeEventListener('change', handleSmallScreenMediaQueryChange)
      clearTimeout(timer)
    }
  }, [])
  function handleMediaQueryChange(e) {
    if (e.matches) {
      console.log('Has changed to large or medium screen size')
      setOpen(true)
      return
    }
  }

  function handleSmallScreenMediaQueryChange(e) {
    clearTimeout(timer)
    if (e.matches) {
      console.log('Has changed to small screen device')
      setOpen(false)
      drawerRef.current.classList.add('no-transition')
      timer = setTimeout(() => {
        drawerRef.current.classList.remove('no-transition')
      }, 500)
    }
  }
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

          <Button
            arial-lable="open navigation menu"
            variant={'neutral'}
            onClick={() => setOpen(!isOpen)}
            className="hamburger"
          >
            <i className="fa-solid fa-bars" />
          </Button>
          <nav
            className="drawer"
            data-open={isOpen}
            aria-hidden={!isOpen}
            ref={drawerRef}
            onClick={(e) => {
              e.target.blur()
              const anchor = 'A'
              const button = 'BUTTON'
              const nodeType = e.target.nodeName
              if (
                (nodeType === anchor || nodeType === button) &&
                smql.matches
              ) {
                setOpen(false)
              }
            }}
          >
            <Button
              variant="neutral"
              aria-label={'Close menu'}
              onClick={() => setOpen(!isOpen)}
              className="align-right close"
            >
              X
            </Button>
            <NavLink className="link" href="#">
              <i className="fa-solid fa-home icon"></i> Home
            </NavLink>
            <NavLink className="link" to={'/shop'}>
              <i className="fa-solid fa-wine-glass icon"></i> Shop
            </NavLink>
            {isAuthenticated ? (
              <NavLink className="link" to={'#'}>
                <i className="fa-solid fa-user"></i> <span>Profile</span>
              </NavLink>
            ) : (
              <NavLink className="link" to={'/login'}>
                <span>Login </span>
              </NavLink>
            )}
            <NavLink className="link" to={'/cart'}>
              <i className="cart fa-solid fa-cart-shopping"></i>

              <span>
                Cart {cart?.totalItems ? `(${cart?.totalItems})` : ''}
              </span>
            </NavLink>
          </nav>
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
