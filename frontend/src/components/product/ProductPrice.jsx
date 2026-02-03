import React from 'react'
export function ProductPrice({ price, variant, classes }) {
  const className = [
    'product-price',
    variant ? `product-price--${variant}` : '',
    classes,
  ]
    .filter(Boolean)
    .join(' ')
  return <div className={className}>$ {price}</div>
}
