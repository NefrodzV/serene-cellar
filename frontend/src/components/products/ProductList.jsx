import React from 'react'
import { ProductItem } from './ProductItem'
import { useProducts } from '../../hooks'
import { Card } from '../elements/Card'
import { Link } from 'react-router-dom'
export function ProductList() {
  const [products, isLoading] = useProducts()

  if (isLoading) return <div>Product List is loading...</div>
  return (
    <ul className="list">
      {products.map((product) => (
        <Card
          as={Link}
          to={`/shop/${product?.slug}`}
          variant="primary"
          className="rounded card-primary-hover"
        >
          <ProductItem product={product} />
        </Card>
      ))}
    </ul>
  )
}
