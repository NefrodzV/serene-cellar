import React, { useState, useEffect } from 'react'
import { Card } from '../ui'
import { Link } from 'react-router-dom'
import { ProductItem } from './ProductItem'
export function ProductCard({ product }) {
    return (
        <Card className={product.status} as={Link} to={`/shop/${product?.id}`}>
            <ProductItem
                productName={product?.name}
                price={product?.variants?.[0].price}
                images={product?.images?.thumbnail}
            />
        </Card>
    )
}
