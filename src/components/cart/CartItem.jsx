import React from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../../hooks'
export function CartItem({ item }) {
    const { name, images, quantity, price, packSize, slug, unitType } = item
    const params = new URLSearchParams({
        edit: 'true',
        itemId: item.id ?? item.uuid,
        pack: packSize,
        quantity: quantity,
    })
    return (
        <li>
            <article>
                <div>
                    <img
                        alt={name}
                        width={150}
                        srcSet={`${images?.phone} 360w, ${images?.tablet} 720w, ${images?.desktop} 1080w`}
                        sizes={`(max-width: 600px) 360px, (max-width: 1024px) 720px, 1080px`}
                    />
                </div>
                <div>
                    <h3>{name}</h3>
                    <p>Quantity: {quantity}</p>
                    <p>Price: ${price}</p>
                    <p>Unit: {unitType}</p>
                    <Link to={`/shop/${slug}?${params}`}>Edit</Link>
                    <button type="button">Delete</button>
                </div>
            </article>
        </li>
    )
}
