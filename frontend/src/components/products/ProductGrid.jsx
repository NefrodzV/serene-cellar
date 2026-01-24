import React, { useState } from 'react'
import { useProducts } from '../../hooks'
import { Spinner, Tag, Form } from '../ui'
import { useCategories } from '../../hooks/useCategories'
import { Heading } from '../ui/Heading'
import { ProductCard } from './ProductCard'

export function ProductGrid() {
  const filterProducts = (products, filters) => {
    if (!products.length) return products
    if (filters.size) {
      return products.map((product) => {
        if (filters.has(product.typeOfAlcohol)) {
          return {
            data: { ...product },
            visible: true,
            exit: false,
          }
        } else {
          return { data: { ...product }, visible: true, exit: true }
        }
      })
    }
    return products.map((product) => ({
      data: { ...product },
      visible: true,
      exit: false,
    }))
  }
  const { categories } = useCategories()
  const {
    products,
    isLoading,
    filters,
    message,
    onFilterChange,
    removeProduct,
  } = useProducts()

  const visibleProducts = filterProducts(products, filters)
  return (
    <div className="products-container">
      <Heading>Products</Heading>
      <Form className="filters" aria-label="Product filters">
        {categories.map((type) => (
          <Tag
            key={type}
            id={`alcohol-${type}`}
            value={type}
            onChange={onFilterChange}
          >
            {type}
          </Tag>
        ))}
      </Form>

      <ul className="products-grid">
        {isLoading ? (
          <Spinner
            style={{
              position: 'absolute',
              inset: 0,
            }}
            message={message}
          />
        ) : null}
        {visibleProducts.map((visibleProduct, i) => {
          return (
            <ProductCard
              key={visibleProduct.data.name}
              product={visibleProduct.data}
              shouldExit={visibleProduct.exit}
              i={i}
              onTransitionEnd={() => {
                if (visibleProduct.exit) {
                  removeProduct(visibleProduct.data.id)
                }
              }}
            />
          )
        })}
      </ul>
    </div>
  )
}
