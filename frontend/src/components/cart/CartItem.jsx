import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../hooks'
export function CartItem({ item }) {
  const { id, name, images, quantity, price, packSize, slug, unitType } = item
  const params = new URLSearchParams({
    edit: 'true',
    itemId: item.id ?? item.uuid,
    pack: packSize,
    quantity: quantity,
  })
  const { deleteItem, increment, decrement } = useCart()

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
          <h3>{name}</h3>

          <p>Price: ${price}</p>
          <p>Unit: {unitType}</p>
          {/* <Link to={`/shop/${slug}?${params}`}>Edit</Link> */}
          <div className="item-control">
            <button className="button primary" onClick={() => decrement(item)}>
              -
            </button>
            <span className="quantity">{quantity}</span>
            <button className="button primary" onClick={() => increment(item)}>
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
        </div>
      </article>
    </li>
  )
}
