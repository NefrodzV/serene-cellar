import React from 'react'
import { Link } from 'react-router-dom'
import { Thumbnail } from '../ui/Thumbnail'
export function ProductItem({ product }) {
  const { images, id, name, prices, slug } = product
  return (
    <article className="product-item" state={{ product }}>
      <Thumbnail data={product?.thumbnail} />
      <h3 className="bolder">{name}</h3>
      <p className="small-text bold">{` $${prices.SIX_PACK.value}`}</p>
    </article>
  )
}
