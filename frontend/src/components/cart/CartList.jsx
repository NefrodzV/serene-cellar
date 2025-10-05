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
        <Card
          key={item.id}
          as="li"
          variant="primary"
          style={{ '--stagger': `${i * 0.2}s` }}
          className={`rounded from-left ${hasMounted ? 'slide-in' : ''} ${item.delete ? 'cart-item-delete' : ''}`}
          onTransitionEnd={() => {
            if (item.delete) {
              setTimeout(() => {
                deleteItem(item.id)
              }, 500)
            }
          }}
        >
          <CartItem key={item.id ?? item.uuid} item={item} />
        </Card>
      ))}
    </ul>
  )
}
