import { useCart } from '../../hooks'
import { Card } from '../elements/Card'
import { CartItem } from './CartItem'
import React from 'react'

export function CartList() {
  const { cart, updateItemAnimation } = useCart()

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
        <Card
          key={item.id}
          as="li"
          variant="primary"
          style={{ '--stagger': `${i * 0.2}s` }}
          className={`rounded from-left ${item.animate ? 'slide-in' : ''}`}
        >
          <CartItem
            key={item.id ?? item.uuid}
            item={item}
            onMount={() => {
              if (!item.animation) {
                updateItemAnimation(item.id, true)
              }
            }}
          />
        </Card>
      ))}
    </ul>
  )
}
