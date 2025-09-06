import { CartList } from '../components'
import React from 'react'
import { useCart, useUser } from '../hooks'
export function CartPage() {
  const { cart } = useCart()
  const { isAuthenticated } = useUser()
  console.log(cart)

  return (
    <div className="cart-page">
      <h2 className="title">
        <i className="fa-solid fa-cart-shopping"></i> Shopping Cart
      </h2>

      <div className="main">
        <CartList />
        {cart?.isEmpty ? null : (
          <div className="checkout">
            <p>
              Review your items and continue to payment to complete your
              purchase.
            </p>
            <p>
              <strong>
                {' '}
                Subtotal ({`${cart.totalItems} items`}): ${cart?.subtotal}
              </strong>
            </p>
            <p>
              <strong>
                {' '}
                Total ({`${cart.totalItems} items`}): ${cart?.total}
              </strong>
            </p>
            <button
              className="button accent fullwidth"
              aria-label="Proceed to payment"
              disabled={!isAuthenticated || !cart?.canCheckout}
              type="button"
            >
              Continue to Payment
            </button>
            <p>Your payment will be processed securely.</p>
          </div>
        )}
      </div>
    </div>
  )
}
