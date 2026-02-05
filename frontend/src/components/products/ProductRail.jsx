import React from 'react'
import { ProductCard } from './ProductCard'
import { Link } from 'react-router-dom'
export function ProductRail({ products }) {
  return (
    <ul className="product-rail">
      {products?.map((p) => (
        <ProductCard as={Link} product={p} key={p.id} />
      ))}
    </ul>
  )
}
