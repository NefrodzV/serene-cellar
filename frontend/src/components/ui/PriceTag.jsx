import React from 'react'
export function PriceTag({ dollars, cents }) {
  return (
    <span className="price-tag">
      $<span>{dollars}</span>
      <span className="cents">{cents}</span>
    </span>
  )
}
