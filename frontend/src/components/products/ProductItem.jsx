import React from 'react'
import { Link } from 'react-router-dom'
import { Title, Thumbnail, PriceTag } from '../ui'
import { API_URL } from '../../config'
import { ProductTitle } from '../product/ProductTitle'

export function ProductItem({ product }) {
  const smallestPrice = product?.variants[0].price.toString()
  const [dollars = 0, cents = 0] = smallestPrice?.split('.')
  return (
    <article className="product-item">
      <Thumbnail
        images={{
          150: `${API_URL}/${product?.images?.thumbnail?.[150]}`,
          300: `${API_URL}/${product?.images?.thumbnail?.[300]}`,
          450: `${API_URL}/${product?.images?.thumbnail?.[450]}`,
        }}
        alt={`${product.name} thumbnail`}
      />
      <ProductTitle text={product?.name} />
      <PriceTag dollars={dollars} cents={cents} />
    </article>
  )
}
