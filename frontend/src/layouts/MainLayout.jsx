import React, { useEffect, useRef, useState } from 'react'
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom'
import { useCart, useUser } from '../hooks'
import { MessageContainer } from '../components/messages/MessageContainer'
import logo from '../assets/logo-bg.png'
import { Nav } from '../components/navigation/Nav'
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
        <nav
          className="drawer"
          data-open={isOpen}
          aria-hidden={!isOpen}
          ref={drawerRef}
          onClick={(e) => e.target.blur()}
        >
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
