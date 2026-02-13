import React, { useState, useEffect } from 'react'
import { Card } from '../ui'
import { Link } from 'react-router-dom'
import { ProductItem } from './ProductItem'
export function ProductCard({ product, onExit }) {
    const minPrice = Math.min(
        ...product.variants.map((variant) => variant.price)
    )

    return (
        <Card
            className={product.status}
            as={Link}
            to={`/shop/${product?.id}`}
            onTransitionEnd={(e) => {
                if (e.target !== e.currentTarget) return
                if (product.status === 'exit') onExit(product.id)
            }}
        >
            <ProductItem
                productName={product?.name}
                price={minPrice}
                images={product?.images?.thumbnail}
            />
        </Card>
    )
}
