import React from 'react'
import { Button } from './Button'
export function QuantityStepper({
  quantity,
  min,
  max,
  onIncrement,
  OnDecrement,
}) {
  return (
    <div className="quantity-stepper">
      <Button
        variant="transparent"
        disabled={quantity <= min}
        onClick={OnDecrement}
      >
        <div className="button-icon-container">
          <i class="fa-solid fa-arrow-down"></i>
        </div>
      </Button>

      <div className="cart-item-quantity">
        <div
          className="quantity-container"
          style={{
            width: `clamp(2ch, ${quantity.length}ch, 7ch)`,
          }}
        >
          {quantity}
        </div>
      </div>

      <Button
        variant="transparent"
        disabled={quantity >= max}
        onClick={onIncrement}
      >
        <div className="button-icon-container">
          <i class="fa-solid fa-arrow-up"></i>
        </div>
      </Button>
    </div>
  )
}
