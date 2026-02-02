import { useCart, useProduct } from '../hooks'
import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { ProductHeader } from '../components/product'
export function ProductPage() {
  const MIN_QUANTITY = 1
  const { id } = useParams()
  const { product, isLoading, message } = useProduct(id)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const subtotal = selectedVariant
    ? (quantity * selectedVariant?.price).toFixed(2)
    : null

  useEffect(() => {
    setSelectedVariant(product?.variants[0])
  }, [product])

  return (
    <div className="product-page">
      <ProductHeader
        product={product}
        quantity={quantity}
        subtotal={subtotal}
        minQuantity={MIN_QUANTITY}
        onIncrement={() => {
          if (quantity >= selectedVariant?.stock) return
          setQuantity((prev) => prev + 1)
        }}
        onDecrement={() => {
          if (quantity <= MIN_QUANTITY) return
          setQuantity((prev) => prev - 1)
        }}
        selectedVariant={selectedVariant}
        onVariantSelected={(id) => {
          const variant = product.variants.find((v) => v.id === id)
          setSelectedVariant(variant)
        }}
        onAddToCart={() => console.log('Add Item')}
      />
      <hr />
    </div>
  )
}
