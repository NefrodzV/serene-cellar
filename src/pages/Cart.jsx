import { CartList } from '../components'
import React from 'react'
import { useCart } from '../hooks'
export function CartPage() {
    const { total } = useCart()
    return (
        <main>
            <div>
                <h2>Cart</h2>
                <CartList />
            </div>
            <div>
                <p>Total: ${total}</p>
                <button type="button">Checkout</button>
            </div>
        </main>
    )
}
