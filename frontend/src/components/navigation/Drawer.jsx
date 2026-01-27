import React, { useRef, useState, useEffect } from 'react'
import { Button } from '../ui'
import { NavLink } from 'react-router-dom'
export function Drawer({ navItems = [] }) {
  const mql = useRef(window.matchMedia('(min-width: 600px)'))
  const smql = useRef(window.matchMedia('(max-width: 600px)'))
  const drawerRef = useRef(null)
  let timer
  const [isOpen, setOpen] = useState(() => {
    const isBigScreen = mql.current.matches
    const isSmallScreen = smql.current.matches
    if (isBigScreen) return true
    if (isSmallScreen) return false
  })
  useEffect(() => {
    mql.current.addEventListener('change', handleMediaQueryChange)
    smql.current.addEventListener('change', handleSmallScreenMediaQueryChange)
    return () => {
      mql.current.removeEventListener('change', handleMediaQueryChange)
      smql.current.removeEventListener(
        'change',
        handleSmallScreenMediaQueryChange
      )
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
          console.log(e)
          e.target.blur()
          const anchor = 'A'
          const button = 'BUTTON'
          const nodeType = e.target.nodeName
          if (
            (nodeType === anchor || nodeType === button) &&
            smql.current.matches
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
        <div className="image-container">
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
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
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
        </div>
        <hr />
        {navItems.map((item) => (
          <NavLink key={item.link} className="link" to={item.link}>
            {item.icon}
            <span>{item.text}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}
