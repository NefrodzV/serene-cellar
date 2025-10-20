import React, { useEffect, useState } from 'react'
import { ProductItem } from './ProductItem'
import { useProducts } from '../../hooks'
import { Link } from 'react-router-dom'
import { Spinner, Card, Tag, Form } from '../ui'
import { useCategories } from '../../hooks/useCategories'
import { Heading } from '../ui/Heading'
export function ProductList() {
  const { alcoholTypes } = useCategories()
  const { products = [], isLoading, onFilterChange } = useProducts()

  const [entered, setEntered] = useState(false)
  useEffect(() => {
    if (!isLoading && products.length) {
      requestAnimationFrame(() => setEntered(true))
      // requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)))
    } else {
      setEntered(false)
    }
  }, [isLoading, products.length])
  if (isLoading) return <Spinner />
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
    </div>
  )
}
