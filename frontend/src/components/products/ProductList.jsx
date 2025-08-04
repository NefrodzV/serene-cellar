import React from 'react'
import { ProductCard } from './ProductCard'
import { useProducts } from '../../hooks'
export function ProductList() {
  const [products, isLoading] = useProducts()

  if (isLoading) return <div>Product List is loading...</div>
  return (
    <ul className="list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ul>
  )
}
