import { useCart } from '../../hooks'
import { Card } from '../elements/Card'
import { CartItem } from './CartItem'
import React, { useEffect, useState } from 'react'

export function CartList() {
  const { cart, deleteItem } = useCart()

  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setHasMounted(true))
    )
  }, [])

  if (cart?.isEmpty) {
    return (
      <div className="empty-list-message">
        <p>Your cart is empty</p>
      </div>
    )
  }
  return (
    <ul aria-label="Your current cart items" className="cart-list">
      {cart?.items?.map((item, i) => (
        <CartItem item={item} key={item.id ?? item.uuid} index={i} />
      ))}
    </ul>
  )
}
