import React, { useState, useEffect } from 'react'
import { Card } from '../ui'
import { Link } from 'react-router-dom'
import { ProductItem } from './ProductItem'
export function ProductCard({ product, onExit }) {
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
                price={product?.variants?.[0].price}
                images={product?.images?.thumbnail}
            />
        </Card>
    )
}
