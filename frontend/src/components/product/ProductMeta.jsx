import React from 'react'
export function ProductMeta({ spirit, abv, ml }) {
  return (
    <div className="product-meta">
      <span className="meta-item">{spirit}</span>
      <span className="meta-spacer">·</span>
      <span className="meta-item">{abv}% ABV</span>
    </div>
  )
}
