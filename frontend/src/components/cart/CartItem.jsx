import React, { useEffect, useRef, useState } from 'react'
import { useCart } from '../../hooks'
import { Button } from '../elements/Button'
import { Card } from '../elements/Card'
export function CartItem({ index, item, onMount, ...props }) {
  const MIN_ITEM_QUANTITY = 1
  const DELETE_MS = 500
  const STAGGER_RATE_INCREASE = 0.2
  const {
    id,
    name,
    images,
    quantity,
    price,
    unit,
    stock,
    hasDiscount,
    discountPercent,
    finalUnitPrice,
  } = item
  const [hasMounted, setHasMounted] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { increment, decrement, updateItem, deleteItem } = useCart()
  const [rawQuantity, setRawQuantity] = useState(String(quantity))
  useEffect(() => {
    if (!stock) {
      setError('Item is out of stock')
    }
    setRawQuantity(String(quantity))
  }, [quantity])

  useEffect(() => {
    requestAnimationFrame(() => setHasMounted(true))
  }, [])

  return (
    <Card
      key={item.id}
      as="li"
      variant="primary"
      style={{ '--stagger': `${index * STAGGER_RATE_INCREASE}s` }}
      className={`rounded from-left ${hasMounted ? 'slide-in' : ''} ${isDeleting ? 'cart-item-delete' : ''}`}
      onTransitionEnd={() => {
        if (isDeleting) {
          setTimeout(() => {
            deleteItem(item.id)
          }, DELETE_MS)
        }
      }}
    >
      <article className="cart-item">
        <div className="product">
          <div className="image">
            <img
              className="thumbnail"
              alt={name}
              srcSet={`${images?.thumbnail[150]} 1x, ${images?.thumbnail[300]} 2x, ${images?.thumbnail[450]} 3x`}
            />
          </div>
          <div className="content">
            <h3>
              {name} ({unit})
            </h3>
            <p>
              <span className={`${hasDiscount ? 'line-through' : ''}`}>
                ${price}
              </span>
              {hasDiscount && (
                <>
                  <span>&#x27A1;</span> <span>${finalUnitPrice}</span>{' '}
                  <span className="green bold">{discountPercent}% OFF</span>
                </>
              )}
            </p>
          </div>
          <div className="item-control">
            <Button
              variant="secondary"
              disabled={quantity === MIN_ITEM_QUANTITY}
              onClick={() => decrement(id, Number(quantity))}
            >
              -
            </Button>

            <input
              onChange={(e) => {
                // setError('')
                const value = e.target.value.replace(/\D/g, '')
                if (Number(value) > stock) {
                  // setError('Quantity unavailable')
                }
                setRawQuantity(value)
              }}
              name="quantity"
              style={{
                width: `${rawQuantity.length}ch`,
              }}
              value={rawQuantity}
              className="input primary quantity"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min={MIN_ITEM_QUANTITY}
              max={stock}
              onBlur={(e) => {
                setError('')
                if (rawQuantity === '' || Number(rawQuantity) <= 0) {
                  setRawQuantity(String(quantity))
                  return
                }
                const val = rawQuantity.replace(/^0+(?!$)/g, '')
                setRawQuantity(val)
                if (val > stock) {
                  setRawQuantity(String(quantity))
                  return
                }
                updateItem(id, Number(rawQuantity))
              }}
            />

            <Button
              variant="secondary"
              disabled={quantity >= stock}
              onClick={() => increment(id, Number(rawQuantity))}
            >
              +
            </Button>
            <Button
              variant="secondary"
              aria-label="Delete cart item"
              type="button"
              onClick={() => {
                setIsDeleting(true)
              }}
            >
              <i class="fa-solid fa-trash"></i>
            </Button>
          </div>
          <span className="cart-item-subtotal bold">
            $ {item?.finalLineTotal}
          </span>
        </div>
      </article>
    </Card>
  )
}
