import { CartList } from '../components'
import React from 'react'
import { useCart, useUser } from '../hooks'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
export function CartPage() {
  const { cart } = useCart()
  const { isAuthenticated } = useUser()

  return (
    <div className="cart-page">
      <h2 className="title">
        <i className="fa-solid fa-cart-shopping"></i> Shopping Cart
      </h2>

      <div className="main">
        <CartList />
        {cart?.isEmpty ? null : (
          <Card variant="primary" className="height-fit-content rounded">
            <div className="checkout ">
              <h2>Checkout Summary</h2>
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
              <Button
                variant="accent"
                aria-label="Proceed to payment"
                className="fullwidth"
                disabled={!isAuthenticated || !cart?.canCheckout}
                type="button"
              >
                Continue to Payment
              </Button>
              <p>Your payment will be processed securely.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
