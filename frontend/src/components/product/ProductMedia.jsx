import React from 'react'
export function ProductMedia({ src, srcSet, alt, loading = 'eager', sizes }) {
  return (
    <img
      className="product-media"
      src={src}
      alt={alt}
      srcSet={srcSet}
      loading={loading}
      sizes={sizes}
    />
  )
}
