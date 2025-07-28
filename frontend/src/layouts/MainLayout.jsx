import React from 'react'
import { Outlet, Link, NavLink } from 'react-router-dom'
import { useCart, useUser } from '../hooks'
import { MessageContainer } from '../components/messages/MessageContainer'
export function MainLayout() {
  const { totalItems } = useCart()
  const { isAuthenticated, user } = useUser()
  return (
    <div className="app-layout">
      <header>
        <div>Logo</div>
        <nav>
          {/* TODO: USE ELEMENTS HERE FOR NAVIGATION FROM REACT ROUTER */}
          <NavLink href="#">Home</NavLink>
          <NavLink to={'/shop'}>Shop</NavLink>
          {isAuthenticated ? (
            <NavLink to={'#'}>{user.username}</NavLink>
          ) : (
            <NavLink to={'/login'}>Login</NavLink>
          )}
          <NavLink to={'/cart'}>Cart {totalItems}</NavLink>
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
