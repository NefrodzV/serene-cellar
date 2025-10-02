import React, { useEffect, useRef, useState } from 'react'
import { useCart } from '../../hooks'
import { Button } from '../elements/Button'
export function CartItem({ item, onMount, ...props }) {
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

  const MIN_ITEM_QUANTITY = 1
  const { deleteItem, increment, decrement, updateItem } = useCart()
  const [rawQuantity, setRawQuantity] = useState(String(quantity))
  const [error, setError] = useState('')
  useEffect(() => {
    if (!stock) {
      setError('Item is out of stock')
    }
    setRawQuantity(String(quantity))
  }, [quantity])

  useEffect(() => {
    onMount ? onMount() : null
  }, [])

  return (
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
            </span>{' '}
            {hasDiscount && (
              <>
                <span>&#x27A1;</span> <span>${finalUnitPrice}</span>{' '}
                <span className="green bold">{discountPercent}% OFF</span>
              </>
            )}
          </p>

          <p>{stock} in stock</p>
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
              setError('')
              const value = e.target.value.replace(/\D/g, '')
              if (Number(value) > stock) {
                setError('Quantity unavailable')
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
              deleteItem(id)
            }}
          >
            <i class="fa-solid fa-trash"></i>
          </Button>
        </div>{' '}
        {error && <div className="error">{error}</div>}
      </div>
    </article>
  )
}
