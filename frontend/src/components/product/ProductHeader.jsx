import React from 'react'
import { ProductContent, ProductMedia } from './index.js'
import { API_URL } from '../../config/index.js'
export function ProductHeader({
  product,
  quantity,
  subtotal,
  selectedVariant,
  minQuantity,
  onIncrement,
  onDecrement,
  onVariantSelected,
  onAddToCart,
}) {
  return (
    <div className="product-header">
      <ProductMedia
        src={`${API_URL + '/' + product?.images?.thumbnail[450]}`}
        srcSet={`${API_URL + '/' + product?.images?.thumbnail[150]} 150w,  ${API_URL + '/' + product?.images?.thumbnail[300]} 300w, ${API_URL + '/' + product?.images?.thumbnail[450]} 450w`}
        sizes="(max-width: 768px) 100vw, 420px"
      />
      <ProductContent
        product={product}
        quantity={quantity}
        subtotal={subtotal}
        selectedVariant={selectedVariant}
        minQuantity={minQuantity}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onVariantSelected={onVariantSelected}
        onAddToCart={onAddToCart}
      />
    </div>
  )
}
