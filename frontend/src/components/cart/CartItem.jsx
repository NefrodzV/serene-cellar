import React, { useEffect, useRef, useState } from 'react'
import { useCart } from '../../hooks'

export function CartItem({ item }) {
  const {
    id,
    name,
    images,
    quantity,
    unitPrice,
    packSize,
    slug,
    unitType,
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
  const lastGoodQuantity = useRef(quantity)
  function onChange(e) {}

  return (
    <li className="cart-item">
      <article className="product">
        <div className="image">
          <img
            alt={name}
            width={150}
            srcSet={`${images?.phone} 360w, ${images?.tablet} 720w, ${images?.desktop} 1080w`}
            sizes={`(max-width: 600px) 360px, (max-width: 1024px) 720px, 1080px`}
          />
        </div>
        <div className="content">
          <h3>
            {name} ({unitType})
          </h3>
          <p>
            <span className={`${hasDiscount ? 'line-through' : ''}`}>
              ${unitPrice}
            </span>{' '}
            {hasDiscount && (
              <>
                <span>&#x27A1;</span> <span>${finalUnitPrice}</span>{' '}
                <span className="green bold">{discountPercent}% OFF</span>
              </>
            )}
          </p>

          <p>Available: {stock}</p>
          <div className="item-control">
            <button
              disabled={quantity === MIN_ITEM_QUANTITY}
              className="button primary"
              onClick={() => decrement(item, Number(quantity))}
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
                  // Maybe send a message here that quantity reverted because it was an error
                  return
                }

                updateItem(item, Number(rawQuantity))

                // Send to server if needed here
              }}
            />
            {/* <span className="quantity">{quantity}</span> */}
            <button
              disabled={quantity >= stock}
              className="button primary"
              onClick={() => increment(item, Number(rawQuantity))}
            >
              +
            </button>

            <button
              aria-label="Delete cart item"
              className="button primary delete"
              type="button"
              onClick={() => {
                deleteItem(item)
              }}
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
          {error && <div className="error">{error}</div>}
        </div>
      </article>
    </li>
  )
}
