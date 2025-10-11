import React, { useEffect, useState } from 'react'
import { ProductItem } from './ProductItem'
import { useProducts } from '../../hooks'
import { Link } from 'react-router-dom'
import { Spinner, Card, Tag } from '../ui'
import { useCategories } from '../../hooks/useCategories'
import { Heading } from '../ui/Heading'
export function ProductList() {
  const { categories } = useCategories()
  const { products = [], isLoading } = useProducts(categories)

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
      <aside className="filters" aria-label="Product filters">
        {categories.map((cat) => (
          <Tag
            id={`category-${cat}`}
            value={cat}
            onChange={(e) => console.log(e.target.value)}
          >
            {cat}
          </Tag>
        ))}
      </aside>

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
