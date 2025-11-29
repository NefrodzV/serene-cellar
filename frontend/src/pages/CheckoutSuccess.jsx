import React from 'react'
import { Link } from 'react-router-dom'
export function CheckoutSuccess() {
  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout rounded">
          <div className="success-icon">
            <i class="checkmark fa-solid fa-check"></i>
          </div>

          <h1 className="title">Payment successful</h1>
          <p className="subtitle">
            Thank you for your purchase. Your order is now being prepared.
          </p>

          <h2 className="title">Summary</h2>
          <div className="rows">
            <span>Order ID</span>
            <span>Order #</span>
          </div>
          <div className="rows">
            <span>Total Paid</span>
            <span>$paid cash</span>
          </div>
          <div className="rows">
            <span>Email</span>
            <span>user email</span>
          </div>
          <details>
            <summary>Items</summary>
            order items ul
          </details>
          <div className="actions">
            <Link className="button button-primary">View order</Link>
            <Link className="button button-primary" to={'/shop'}>
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
