import React from 'react'
import {
  ProductMeta,
  ProductTitle,
  VariantSelector,
  ProductDescription,
  ProductSubtotal,
} from './index.js'
import { QuantityStepper } from '../ui/QuantityStepper.jsx'
import { Button } from '../ui/Button.jsx'
export function ProductContent({
  product,
  quantity,
  subtotal,
  onIncrement,
  onDecrement,
  minQuantity,
  selectedVariant,
  onVariantSelected,
  onAddToCart,
}) {
  return (
    <section className="product-content">
      <ProductTitle>{product?.name}</ProductTitle>
      <ProductMeta
        spirit={product?.typeOfAlcohol}
        ml={product?.ml}
        abv={product?.abv}
        container={product?.container}
      />
      <div className="product-option">
        <div className="option-label">Size</div>
        <VariantSelector
          selectedVariant={selectedVariant}
          variants={product?.variants}
          onVariantSelected={onVariantSelected}
        />
      </div>

      <div className="product-option">
        <div className="option-label">Quantity</div>
        <QuantityStepper
          min={minQuantity}
          quantity={quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
      </div>

      {subtotal && <ProductSubtotal subtotal={subtotal} />}
      <Button className="add-to-cart" onClick={onAddToCart}>
        <i className="fa-solid fa-cart-shopping"></i>Add to cart
      </Button>

      <ProductDescription text={product?.description} />
    </section>
  )
}
