import React, { useEffect, useState } from 'react'
import { ProductItem } from './ProductItem'
import { useProducts } from '../../hooks'
import { Card } from '../ui/Card'
import { Link } from 'react-router-dom'
import { Loader } from '../ui/Loader'
import { useCategories } from '../../hooks/useCategories'
export function ProductList() {
  const { products = [], isLoading } = useProducts()
  const { categories } = useCategories()
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    if (!isLoading && products.length) {
      requestAnimationFrame(() => setEntered(true))
      // requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)))
    } else {
      setEntered(false)
    }
  }, [isLoading, products.length])
  if (isLoading) return <Loader />
  return (
    <div className="products-container">
      <h1>Products</h1>
      <aside className="filters" aria-label="Product filters">
        {categories.map((cat) => (
          <Card
            as="label"
            variant="secondary"
            className="selectable-card rounded"
            htmlFor={`category-${cat}`}
          >
            <input
              id={`category-${cat}`}
              type="checkbox"
              value={cat}
              onChange={(e) => console.log(e.target.value)}
            />
            <span className="checkmark"></span>
            <span>{cat}</span>
          </Card>
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
