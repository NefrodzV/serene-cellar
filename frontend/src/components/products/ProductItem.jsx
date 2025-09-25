import React from 'react'
import { Link } from 'react-router-dom'
export function ProductItem({ product }) {
  const { images, id, name, prices, slug } = product
  return (
    <li>
      <Link className="card" to={`/shop/${slug}`} state={{ product }}>
        <img
          width={150}
          srcSet={`${images?.thumbnail[150]} 1x, ${images?.thumbnail[300]} 2x, ${images?.thumbnail[450]} 3x`}
        />
        <h3>{name}</h3>
        <p>{`From $${prices.SIX_PACK.value}`}</p>
      </Link>
    </li>
  )
}
