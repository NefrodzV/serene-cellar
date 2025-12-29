import { CartList } from '../components'
import React from 'react'
import { useCart, useUser } from '../hooks'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { API_URL } from '../config'

export function CartPage() {
  const { cart } = useCart()
  const { isAuthenticated } = useUser()

  async function checkoutHandler() {
    try {
      const res = await fetch(`${API_URL}/checkout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await res.json()
      window.location.href = data.url
    } catch (error) {
      console.error('Checkout error:', error)
    }
  }

  return (
    <div className="cart-page">
      <h1 className="heading">
        <i className="fa-solid fa-cart-shopping"></i> Shopping Cart
      </h1>

      <div className="main">
        <CartList />
        {cart?.isEmpty ? null : (
          <Card className="height-fit-content rounded">
            <div className="checkout">
              <h2>Checkout Summary</h2>
              <p>
                Review your items and continue to payment to complete your
                purchase.
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
                onClick={checkoutHandler}
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
