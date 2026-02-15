import React from 'react'
import { Link } from 'react-router-dom'
export function CheckoutSuccess() {
    return (
        <div className="checkout-page">
            <i className="checkmark fa-solid fa-check checkout-page__checkmark"></i>

            <h1 className="title">Payment successful</h1>
            <p className="subtitle">
                Thank you for your purchase. Your order is now being prepared.
            </p>

            <Link className="button">View order</Link>
            <Link className="button" to={'/shop'}>
                Continue shopping
            </Link>
        </div>
    )
}
