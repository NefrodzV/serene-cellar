import React, { useState, useEffect } from 'react'
import { Card } from '../ui'
import { Link } from 'react-router-dom'
import { ProductItem } from './ProductItem'
export function ProductCard({ product, i, shouldExit = false, ...props }) {
  const [entered, setEntered] = useState(false)
  // const delay = shouldExit ? 0 : i * 0.2
  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)))
  }, [])

  return (
    <Card
      as={Link}
      to={`/shop/${product?.id}`}
      variant="primary"
      className={`rounded card-primary-hover from-left ${entered ? 'slide-in' : ''} ${shouldExit ? 'slide-out' : ''}`}
      // style={{ '--stagger': `${delay}s` }}
      {...props}
    >
      <ProductItem product={product} />
    </Card>
  )
}
