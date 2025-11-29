import React from 'react'
import { Link } from 'react-router-dom'

export function CheckoutCancel() {
  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout rounded">
          <div className="cancel-icon">
            <i class="fa-solid fa-xmark"></i>
          </div>
          <h1 className="title">Payment Canceled</h1>
          <p className="subtitle">
            You can try again or continue shopping whenever you’re ready.
          </p>
          <div className="actions">
            <Link className="button button-primary" to={'/cart'}>
              View cart
            </Link>
            <Link className="button button-primary" to={'/shop'}>
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
