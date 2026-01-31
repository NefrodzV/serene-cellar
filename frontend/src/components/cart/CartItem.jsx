import React, { useEffect, useRef, useState } from 'react'
import { useCart } from '../../hooks'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { API_URL } from '../../config'
import { Spinner, QuantityStepper } from '../ui'

export function CartItem({ index, item }) {
  const MIN_ITEM_QUANTITY = 1
  const DELETE_MS = 500
  const STAGGER_RATE_INCREASE = 0.2
  const {
    id,
    priceId,
    name,
    images,
    quantity,
    price,
    package: unit,
    stock,
    ml,
    hasDiscount,
    lineTotal,
    container,
    purchasable,
  } = item

  const [hasMounted, setHasMounted] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { increment, decrement, updateItem, deleteItem, isItemBusy } = useCart()

  const isBusy = isItemBusy(id)

  useEffect(() => {
    requestAnimationFrame(() => setHasMounted(true))
  }, [])

  return (
    <Card
      key={item?.priceId}
      as="li"
      style={{ '--stagger': `${index * STAGGER_RATE_INCREASE}s` }}
      className={`rounded from-left ${hasMounted ? 'slide-in' : ''} ${isDeleting ? 'is-deleting' : ''}`}
    >
      <article className="cart-item">
        <div className="product">
          <div className="cart-item-image">
            <img
              className="thumbnail"
              alt={name}
              srcSet={`${API_URL + '/' + images?.thumbnail[150]} 1x, ${API_URL + '/' + images?.thumbnail[300]} 2x, ${API_URL + '/' + images?.thumbnail[450]} 3x`}
            />
          </div>

          <div className="content">
            <div className="cart-item-header">
              <h3 className="cart-item-product-name">{name}</h3>
            </div>
            {purchasable ? (
              <span className="cart-item-in-stock cart-item-content-row">
                In stock
              </span>
            ) : (
              <span className="cart-item-out-of-stock cart-item-content-row">
                Out of stock
              </span>
            )}

            <div className="cart-item-content-row">
              <span>${price} each</span>
            </div>
            <div className="cart-item-content-row">
              <span className="cart-item-label">Package: </span>
              {unit}
            </div>
            <div className="cart-item-content-row">
              <span className="cart-item-label">Volume: </span>
              {ml}mL
            </div>
            <div className="cart-item-content-row">
              <span className="cart-item-label">Container: </span>
              {container}
            </div>

            <span className="cart-item-subtotal bold">
              Subtotal: ${item?.lineTotal}
            </span>
            <div className="control-container">
              <QuantityStepper
                quantity={quantity}
                min={MIN_ITEM_QUANTITY}
                max={stock}
                onIncrement={() => {
                  increment(item, Number(quantity))
                }}
                OnDecrement={() => {
                  decrement(item, Number(quantity))
                }}
              />
              <Button
                variant="transparent"
                aria-label="Delete cart item"
                type="button"
                onClick={() => {
                  setIsDeleting(true)
                  deleteItem(id)
                }}
              >
                <div className="button-icon-container delete">
                  <i class="fa-solid fa-trash"></i>
                </div>
              </Button>
            </div>
          </div>
        </div>
        {isBusy && <Spinner />}
        {/* <div className="overlay" data-open={isBusy}></div> */}
      </article>
    </Card>
  )
}
