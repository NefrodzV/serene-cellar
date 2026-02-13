import React from 'react'
import { ProductPrice } from './ProductPrice'
export function ProductSubtotal({ subtotal }) {
    return (
        <div className="product-subtotal">
            <div className="subtotal-label">Subtotal</div>
            <ProductPrice price={subtotal} />
        </div>
    )
}
