import React from 'react'
import { ProductCard } from './ProductCard'

export function ProductRail({ products }) {
  return (
    <ul className="product-rail">
      {products?.map((p) => (
        <ProductCard product={p} />
      ))}
    </ul>
  )
}
