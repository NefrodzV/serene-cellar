import React from 'react'
import { Link } from 'react-router-dom'
import { Title, Thumbnail, Tag, PriceTag } from '../ui'
export function ProductItem({ product }) {
  const { images, name, variants } = product
  const smallestPrice = variants[0].price.toString()
  const [dollars = 0, cents = 0] = smallestPrice?.split('.')
  return (
    <article className="product-item" state={{ product }}>
      <Thumbnail data={images?.thumbnail} />
      <Title>{name}</Title>
      <PriceTag dollars={dollars} cents={cents} />
    </article>
  )
}
