import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useCart } from '../hooks'
import { MessageProvider } from '../contexts/MessageContext'
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
          <a href="http://">Login</a>
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
