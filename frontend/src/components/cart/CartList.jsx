import { useCart } from '../../hooks'
import { Card } from '../ui/Card'
import { CartItem } from './CartItem'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
export function CartList() {
  const { cart, deleteItem } = useCart()
  console.log(cart)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setHasMounted(true))
    )
  }, [])

  if (cart?.isEmpty) {
    return (
      <div className="empty-list-message">
        <svg
          className="empty-cart-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 24 24"
          role="img"
          aria-labelledby="title desc"
          fill="none"
        >
          <desc id="desc">
            Shopping cart icon with a not allowed sign overlay to indicate it is
            empty or disabled.
          </desc>

          <g
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3.5 4h2l1.6 8.7c.15.8.85 1.3 1.66 1.3h7.1c.82 0 1.54-.54 1.76-1.33L20.5 8H7.1" />
            <circle cx="10" cy="19" r="1.6" />
            <circle cx="17" cy="19" r="1.6" />
          </g>

          <g
            transform="translate(11 -1)"
            stroke="currentColor"
            stroke-width="1.6"
            fill="none"
            stroke-linecap="round"
          >
            <circle cx="7" cy="7" r="3.8" />
            <line x1="4.9" y1="4.9" x2="9.1" y2="9.1" />
          </g>
        </svg>
        <p>There are no items in your cart</p>
        <Link className="anchor anchor-primary" to={'/shop'}>
          Go to shop
        </Link>
      </div>
    )
  }
  return (
    <ul aria-label="Your current cart items" className="cart-list">
      {cart?.items?.map((item, i) => (
        <CartItem item={item} key={`${item?.id}`} index={i} />
      ))}
    </ul>
  )
}
