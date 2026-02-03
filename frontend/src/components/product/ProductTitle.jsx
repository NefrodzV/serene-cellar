import React from 'react'
export function ProductTitle({
  as: Heading = 'h1',
  children,
  variant = '',
  classes,
}) {
  const className = [
    'product-title',
    variant ? `product-title--${variant}` : '',
    classes,
  ]
    .filter(Boolean)
    .join(' ')

  return <Heading className={className}>{children}</Heading>
}
