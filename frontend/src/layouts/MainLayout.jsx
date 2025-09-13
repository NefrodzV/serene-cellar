import React, { useEffect, useState } from 'react'
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom'
import { useCart, useUser } from '../hooks'
import { MessageContainer } from '../components/messages/MessageContainer'
import logo from '../assets/logo-bg.png'
import { Nav } from '../components/navigation/Nav'
export function MainLayout() {
  const { cart } = useCart()
  const { isAuthenticated, user } = useUser()
  const [isOpen, setOpen] = useState(false)
  const mql = window.matchMedia('(min-width: 600px)')

  useEffect(() => {
    mql.addEventListener('change', handleMediaQueryChange)
    return () => {
      mql.removeEventListener('change', handleMediaQueryChange)
    }
  }, [])
  function handleMediaQueryChange(e) {
    if (e.matches) {
      setOpen(true)
      return
    }
    setOpen(false)
  }
  return (
    <div className="app-layout">
      <header className="header">
        <div className="logo">
          <img src={logo} />
        </div>

        <button
          className="button nav"
          aria-label={'Open menu'}
          onClick={() => setOpen(!isOpen)}
        >
          <i className="fa-solid fa-bars" />
        </button>
        <nav className="drawer" data-open={isOpen} aria-hidden={!isOpen}>
          <button
            aria-label={'Close menu'}
            onClick={() => setOpen(!isOpen)}
            className="button nav"
          >
            X
          </button>
          {/* TODO: USE ELEMENTS HERE FOR NAVIGATION FROM REACT ROUTER */}
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
            <i className="cart fa-solid fa-cart-shopping">
              <span className="total">{cart?.totalItems}</span>
            </i>

            <span>Cart</span>
          </NavLink>
        </nav>
      </header>
      <main className={`main-layout `}>
        <Outlet />
        <MessageContainer />
      </main>
      <footer className="footer">Footer</footer>
    </div>
  )
}
