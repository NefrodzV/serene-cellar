import { useCart } from '../../hooks'
import { CartItem } from './CartItem'
import React from 'react'

export function CartList() {
  const { cart } = useCart()

  if (cart?.isEmpty) {
    return (
      <div className="empty-list-message">
        <p>Your cart is empty</p>
      </div>
    )
  }

  return (
    <ul aria-label="Your current cart items" className="cart-list">
      {cart?.items?.map((item) => (
        <CartItem key={item.id ?? item.uuid} item={item} />
      ))}
    </ul>
  )
}
