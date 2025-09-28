import React from 'react'
import { Link } from 'react-router-dom'
export function ProductItem({ product }) {
  const { images, id, name, prices, slug } = product
  return (
    <div className="product-item" state={{ product }}>
      <img
        width={150}
        srcSet={`${images?.thumbnail[150]} 1x, ${images?.thumbnail[300]} 2x, ${images?.thumbnail[450]} 3x`}
      />
      <h3 className="bolder">{name}</h3>
      <p className="small-text bold">{` $${prices.SIX_PACK.value}`}</p>
    </div>
  )
}
