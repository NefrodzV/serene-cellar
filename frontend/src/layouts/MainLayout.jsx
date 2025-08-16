import React from 'react'
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom'
import { useCart, useUser } from '../hooks'
import { MessageContainer } from '../components/messages/MessageContainer'
export function MainLayout() {
  const { totalItems } = useCart()
  const { isAuthenticated, user } = useUser()
  const { pathname } = useLocation()
  const isShopProductPage =
    pathname.startsWith('/shop/') && pathname !== '/shop'
  return (
    <div className="app-layout">
      <header className="header">
        <div>Logo</div>
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
              <span className="total">{totalItems}</span>
            </i>

            <span>Cart</span>
          </NavLink>
        </nav>
      </header>
      <main className={`main-layout ${isShopProductPage ? 'no-scroll' : ''}`}>
        <Outlet />
        <MessageContainer />
      </main>
      <footer>Footer</footer>
    </div>
  )
}
