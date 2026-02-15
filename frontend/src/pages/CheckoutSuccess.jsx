import React from 'react'
import { Button } from '../components/ui'
import { Link } from 'react-router-dom'
export function CheckoutSuccess() {
    return (
        <div className="checkout-page">
            <i className="checkmark fa-solid fa-check checkout-page__checkmark"></i>

            <h1 className="title">Payment successful</h1>
            <p className="subtitle">
                Thank you for your purchase. Your order is now being prepared.
            </p>

            <Button as={Link} to={'/profile'} variant="anchor">
                View order
            </Button>
            <Button as={Link} to={'/shop'} variant="anchor">
                Continue shopping
            </Button>
        </div>
    )
}
