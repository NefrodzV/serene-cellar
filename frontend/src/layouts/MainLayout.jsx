import React from 'react'
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom'
import { useCart, useUser } from '../hooks'
import { MessageContainer } from '../components/messages/MessageContainer'
import logo from '../assets/logo-bg.png'
export function MainLayout() {
  const { cart } = useCart()
  const { isAuthenticated, user } = useUser()
  return (
    <div className="app-layout">
      <header className="header">
        <div className="logo">
          <img src={logo} />
        </div>
        <nav className="nav">
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
