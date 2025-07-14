import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export function MainLayout() {
  return (
    <div className="app-layout">
      <header>
        <div>Logo</div>
        <nav>
          {/* TODO: USE ELEMENTS HERE FOR NAVIGATION FROM REACT ROUTER */}
          <a href="http://">Home</a>
          <a href="http://">Login</a>
          <Link to={'/cart'}>Cart</Link>
        </nav>
      </header>
      <main className="main-layout">
        <Outlet />
      </main>
      <footer>Footer</footer>
    </div>
  )
}
