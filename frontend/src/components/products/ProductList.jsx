import React from 'react'
import { ProductItem } from './ProductItem'
import { useProducts } from '../../hooks'
export function ProductList() {
  const [products, isLoading] = useProducts()

  if (isLoading) return <div>Product List is loading...</div>
  return (
    <ul className="list">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </ul>
  )
}
