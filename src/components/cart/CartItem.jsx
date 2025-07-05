import React from 'react'
export function CartItem({ item }) {
    console.log(item)
    const { name, images, quantity, pack, slug } = item
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
                    <h3>
                        {name} {unitType}
                    </h3>
                    <p>Quanity: {quantity}</p>
                    <Link to={`/shop/${slug}?edit=true&pack=${unitType}`}>
                        Edit
                    </Link>
                </div>
            </article>
        </li>
    )
}
