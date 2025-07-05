import { useCart } from '../../hooks'
import { CartItem } from './CartItem'
import React from 'react'

export function CartList() {
    const { cartItems } = useCart()

    if (cartItems.length === 0) {
        return (
            <div>
                <p>No items in cart</p>
            </div>
        )
    }

    return (
        <ul>
            {cartItems.map((item) => (
                <CartItem key={item.id ?? item.uuid} item={item} />
            ))}
        </ul>
    )
}
