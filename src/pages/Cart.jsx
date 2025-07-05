import { CartList } from '../components'
import React from 'react'
export function CartPage() {
    return (
        <main>
            <div>
                <h2>Cart</h2>
                <CartList />
            </div>
            <div>
                <button type="button">Checkout $</button>
            </div>
        </main>
    )
}
