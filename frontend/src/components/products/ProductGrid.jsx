import React, { useEffect, useRef, useState } from 'react'
import { useProducts } from '../../hooks'
import { Spinner, Card, Tag, Form } from '../ui'
import { useCategories } from '../../hooks/useCategories'
import { Heading } from '../ui/Heading'
import { ProductCard } from './ProductCard'

export function ProductGrid() {
  const { alcoholTypes } = useCategories()
  const { products = [], isLoading, onFilterChange, filters } = useProducts()

  return (
    <div className="products-container">
      <Heading>Products</Heading>
      <Form className="filters" aria-label="Product filters">
        {alcoholTypes.map((type) => (
          <Tag id={`alcohol-${type}`} value={type} onChange={onFilterChange}>
            {type}
          </Tag>
        ))}
      </Form>

      <ul className="product-grid">
        {isLoading ? (
          <Spinner
            style={{
              position: 'absolute',
              inset: 0,
            }}
          />
        ) : null}
        {products.map((product, i) => {
          return <ProductCard product={product} i={i} />
        })}
      </ul>
    </div>
  )
}
