import React from 'react'
import { Link } from 'react-router-dom'
export function ProductCard({ product }) {
  const { images, id, name, prices, slug } = product
  return (
    <li>
      <Link className="card" to={`/shop/${slug}`} state={{ product }}>
        <img
          width={150}
          srcSet={`${images.phone} 360w, ${images.tablet} 720w, ${images.desktop} 1080w`}
          sizes={`(max-width: 600px) 360px, (max-width: 1024px) 720px, 1080px`}
        />
        <h3>{name}</h3>
        <p>{`From $${prices.SIX_PACK.value}`}</p>
      </Link>
    </li>
  )
}
