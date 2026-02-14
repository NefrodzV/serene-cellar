import { CartList } from '../components'
import React from 'react'
import { useCart, useMessages, useUser } from '../hooks'
import { Card, Button, Spinner } from '../components/ui'
import { API_URL } from '../config'

export function CartPage() {
    const { cart, isLoading, message } = useCart()
    const { isAuthenticated } = useUser()
    const { sendMessage } = useMessages()

    async function checkoutHandler() {
        try {
            console.log('run checkout')
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

    function copy(text, name) {
        navigator.clipboard.writeText(text)
        sendMessage('Copied', `${name} was copied to clipboard`, 'notify')
    }

    return (
        <div className="cart-page">
            {isLoading ? (
                <Spinner
                    style={{
                        position: 'absolute',
                        inset: 0,
                    }}
                    message={message}
                />
            ) : (
                <>
                    <h1 className="heading">
                        <i
                            className="fa-solid fa-cart-shopping"
                            aria-hidden="true"
                        ></i>
                        Shopping Cart
                    </h1>

                    <div className="main">
                        <CartList />
                        {cart?.isEmpty ? null : (
                            <Card as="section" className="cart-checkout">
                                <h2 className="subtitle">Checkout Summary</h2>
                                <p>
                                    Review your items and continue to payment to
                                    complete your purchase.
                                </p>
                                <p>
                                    <strong>
                                        Total ({`${cart.totalItems} items`}
                                        ): ${cart?.total}
                                    </strong>
                                </p>
                                <Button
                                    variant="accent"
                                    aria-label="Proceed to payment"
                                    className="fullwidth"
                                    disabled={
                                        !isAuthenticated || !cart?.canCheckout
                                    }
                                    type="button"
                                    onClick={checkoutHandler}
                                >
                                    Checkout with Stripe
                                </Button>

                                <p>Test Card (No real payment)</p>
                                <div className="flex-row">
                                    <p>Card: 4242 4242 4242</p>
                                    <Button
                                        variant="test-card"
                                        onClick={() =>
                                            copy(
                                                '424242 424242 424242',
                                                'Card number'
                                            )
                                        }
                                    >
                                        Copy
                                    </Button>
                                </div>
                                <div className="flex-row">
                                    <p>Exp date: 12/34 </p>
                                    <Button
                                        variant="test-card"
                                        onClick={() =>
                                            copy('12/34', 'Expiration date')
                                        }
                                    >
                                        Copy
                                    </Button>
                                </div>
                                <div className="flex-row">
                                    <p>CVC: 123</p>
                                    <Button
                                        variant="test-card"
                                        onClick={() => copy('123', 'CVC')}
                                    >
                                        Copy
                                    </Button>
                                </div>
                                <div className="flex-row">
                                    <p>Area Code: 10001</p>
                                    <Button
                                        variant="test-card"
                                        onClick={() =>
                                            copy('10001', 'Area Code')
                                        }
                                    >
                                        Copy
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
