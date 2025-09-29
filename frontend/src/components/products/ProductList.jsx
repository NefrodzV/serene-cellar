import React, { useEffect, useState } from 'react'
import { ProductItem } from './ProductItem'
import { useProducts } from '../../hooks'
import { Card } from '../elements/Card'
import { Link } from 'react-router-dom'
export function ProductList() {
  const [products = [], isLoading] = useProducts()
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    if (!isLoading && products.length) {
      requestAnimationFrame(() => setEntered(true))
      // requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)))
    } else {
      setEntered(false)
    }
  }, [isLoading, products.length])
  if (isLoading) return <div>Product List is loading...</div>
  return (
    <ul className="list">
      {products.map((product, i) => (
        <Card
          key={product.id}
          as={Link}
          to={`/shop/${product?.slug}`}
          variant="primary"
          className={`rounded card-primary-hover from-left ${entered ? 'slide-in' : ''}`}
          style={{ '--stagger': `${i * 0.2}s` }}
        >
          <ProductItem product={product} />
        </Card>
      ))}
    </ul>
  )
}
