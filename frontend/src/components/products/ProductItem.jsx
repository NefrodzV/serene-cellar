import React from 'react'
import { Link } from 'react-router-dom'
import { Title, Thumbnail, PriceTag } from '../ui'
import { API_URL } from '../../config'
import { ProductTitle } from '../product/ProductTitle'
import { ProductPrice } from '../product/ProductPrice'

export function ProductItem({ product }) {
  const smallestPrice = product?.variants[0].price.toString()
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
      <ProductTitle as="h2" classes={'text-center'} variant="card">
        {product.name}
      </ProductTitle>
      <ProductPrice price={smallestPrice} />
    </article>
  )
}
