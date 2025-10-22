import React, { useState, useEffect } from 'react'
import { Card } from '../ui'
import { Link } from 'react-router-dom'
import { ProductItem } from './ProductItem'
export function ProductCard({ product, i, shouldShow = true }) {
  const [entered, setEntered] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)))
  }, [])

  return (
    <Card
      key={product.id}
      as={Link}
      to={`/shop/${product?.id}`}
      variant="primary"
      className={`rounded card-primary-hover from-left ${entered ? 'slide-in' : ''} `}
      style={{ '--stagger': `${i * 0.2}s` }}
    >
      <ProductItem product={product} />
    </Card>
  )
}
