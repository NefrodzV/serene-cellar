import React, { useRef, useState, useEffect } from 'react'
import { Button } from '../ui'
import { NavLink } from 'react-router-dom'
export function Drawer({ navItems = [] }) {
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
    <>
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
          if ((nodeType === anchor || nodeType === button) && smql.matches) {
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
        {navItems.map((item) => (
          <NavLink className="link" to={item.link}>
            {item.icon}
            <span>{item.text}</span>
          </NavLink>
        ))}
        {/* <NavLink className="link" to={'/shop'}>
          <i className="fa-solid fa-wine-glass icon"></i> Shop
        </NavLink> */}
        {/*{isAuthenticated ? (
          <NavLink className="link" to={'#'}>
            <i className="fa-solid fa-user"></i> <span>Profile</span>
          </NavLink>
        ) : (
          <NavLink className="link" to={'/login'}>
            <i class="fa-solid fa-user"></i>
            <span>Login</span>
          </NavLink>
        )}
        
        <NavLink className="link" to={'/cart'}>
          <i className="cart fa-solid fa-cart-shopping"></i>

          <span>Cart {cart?.totalItems ? `(${cart?.totalItems})` : ''}</span>
        </NavLink> */}
      </nav>
    </>
  )
}
