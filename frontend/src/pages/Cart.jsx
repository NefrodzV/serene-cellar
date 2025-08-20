import { CartList } from '../components'
import React from 'react'
import { useCart } from '../hooks'
export function CartPage() {
  const { total } = useCart()
  return (
    <div className="cart-page">
      <h2 className="title">
        <i className="fa-solid fa-cart-shopping"></i>Cart
      </h2>
      <div className="main">
        <CartList />
        <div className="checkout">
          <h2>Order Summary</h2>
          <p>
            Review your items and continue to payment to complete your purchase.
          </p>
          <p>
            Total: <strong>${total}</strong>
          </p>
          <button
            className="button accent fullwidth"
            aria-label="Proceed to payment"
            type="button"
          >
            Continue to Payment
          </button>
          <p>Your payment will be processed securely.</p>
        </div>
      </div>
    </div>
  )
}
