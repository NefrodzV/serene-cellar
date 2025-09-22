import React, { useEffect, useRef, useState } from 'react'
import { useCart } from '../../hooks'

export function CartItem({ item }) {
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

  console.log(item)
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
  return (
    <li className="cart-item">
      <article className="product">
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

          <p>Available: {stock}</p>
        </div>
        <div className="item-control">
          <button
            disabled={quantity === MIN_ITEM_QUANTITY}
            className="button primary"
            onClick={() => decrement(id, Number(quantity))}
          >
            -
          </button>

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

          <button
            disabled={quantity >= stock}
            className="button primary"
            onClick={() => increment(id, Number(rawQuantity))}
          >
            +
          </button>

          <button
            aria-label="Delete cart item"
            className="button primary delete"
            type="button"
            onClick={() => {
              deleteItem(id)
            }}
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>{' '}
        {error && <div className="error">{error}</div>}
      </article>
    </li>
  )
}
