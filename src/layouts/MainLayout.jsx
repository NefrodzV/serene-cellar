import React from 'react'
import { Outlet, Link, NavLink } from 'react-router-dom'
import { useCart } from '../hooks'
import { MessageContainer } from '../components/messages/MessageContainer'
export function MainLayout() {
  const { totalItems } = useCart()
  return (
    <div className="app-layout">
      <header>
        <div>Logo</div>
        <nav>
          {/* TODO: USE ELEMENTS HERE FOR NAVIGATION FROM REACT ROUTER */}
          <a href="http://">Home</a>
          <NavLink to={'/shop'}>Shop</NavLink>
          <NavLink to={'/login'}>Login</NavLink>
          <Link to={'/cart'}>Cart {totalItems}</Link>
        </nav>
      </header>
      <main className="main-layout">
        <Outlet />
        <MessageContainer />
      </main>

      <footer>Footer</footer>
    </div>
  )
}
