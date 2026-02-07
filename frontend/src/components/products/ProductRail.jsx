import React from 'react'
import { ProductCard } from './ProductCard'
import { Link } from 'react-router-dom'
import { Card } from '../ui'
import { ProductItem } from './ProductItem'
export function ProductRail({ products }) {
  return (
    <ul className="product-rail">
      {products?.map((p) => (
        <Card key={p?.id} as={Link} to={`/shop/${p?.id}`}>
          <ProductItem
            productName={p?.name}
            price={p?.price}
            images={p?.images}
          />
        </Card>
      ))}
    </ul>
  )
}
