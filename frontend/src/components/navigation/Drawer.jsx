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
      </nav>
    </>
  )
}
