import React from 'react'
import { Link } from 'react-router-dom'
import { Title, Thumbnail, Tag, PriceTag } from '../ui'
export function ProductItem({ product }) {
  const { images, id, name, prices, slug } = product
  const smallestPrice = String(Object.entries(prices)[0][1].effectiveValue)
  const [dollars, cents] = smallestPrice.split('.')

  return (
    <article className="product-item" state={{ product }}>
      <Thumbnail data={images?.thumbnail} />
      <Title>{name}</Title>
      <PriceTag dollars={dollars} cents={cents} />
    </article>
  )
}
