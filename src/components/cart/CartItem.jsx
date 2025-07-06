import React from 'react'
import { Link } from 'react-router-dom'
export function CartItem({ item }) {
    console.log(item)
    const { name, images, quantity, price, slug, unitType } = item
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
                    <button type="button">Edit</button>
                    <button type="button">Delete</button>
                </div>
            </article>
        </li>
    )
}
