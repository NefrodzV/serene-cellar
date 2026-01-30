import React, { useEffect, useRef, useState } from 'react'
import { useCart } from '../../hooks'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { API_URL } from '../../config'
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
  const { increment, decrement, updateItem, deleteItem } = useCart()
  const [rawQuantity, setRawQuantity] = useState(String(quantity))

  useEffect(() => {
    setRawQuantity(String(quantity))
  }, [quantity])

  console.log(item)
  useEffect(() => {
    requestAnimationFrame(() => setHasMounted(true))
  }, [])

  return (
    <Card
      key={item?.priceId}
      as="li"
      style={{ '--stagger': `${index * STAGGER_RATE_INCREASE}s` }}
      className={`rounded from-left ${hasMounted ? 'slide-in' : ''} ${isDeleting ? 'cart-item-delete' : ''}`}
      onTransitionEnd={(e) => {
        if (e.target !== e.currentTarget) return
        if (isDeleting) {
          setTimeout(() => {
            deleteItem(item)
          }, DELETE_MS)
        }
      }}
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
              <div className="item-control">
                {quantity === 1 ? (
                  <Button
                    variant="transparent"
                    aria-label="Delete cart item"
                    type="button"
                    onClick={() => {
                      setIsDeleting(true)
                    }}
                  >
                    <div className="button-icon-container">
                      <i class="fa-solid fa-trash"></i>
                    </div>
                  </Button>
                ) : (
                  <Button
                    variant="transparent"
                    disabled={quantity === MIN_ITEM_QUANTITY}
                    onClick={() => decrement(item, Number(quantity))}
                  >
                    <div className="button-icon-container">
                      <i class="fa-solid fa-arrow-down"></i>
                    </div>
                  </Button>
                )}

                <div className="cart-item-quantity">
                  <div
                    className="quantity-container"
                    style={{
                      width: `clamp(2ch, ${rawQuantity.length}ch, 7ch)`,
                    }}
                  >
                    {rawQuantity}
                  </div>
                </div>

                <Button
                  variant="transparent"
                  disabled={quantity >= stock}
                  onClick={() => increment(item, Number(rawQuantity))}
                >
                  <div className="button-icon-container">
                    <i class="fa-solid fa-arrow-up"></i>
                  </div>
                </Button>
              </div>

              {quantity > 1 ? (
                <Button
                  variant="transparent"
                  aria-label="Delete cart item"
                  type="button"
                  onClick={() => {
                    setIsDeleting(true)
                  }}
                >
                  <div className="button-icon-container delete">
                    <i class="fa-solid fa-trash"></i>
                  </div>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </article>
    </Card>
  )
}
