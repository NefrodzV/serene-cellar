import React, { useState } from 'react'
import { useProduct, useProductSelection } from '../../hooks'

export function ProductView() {
    const [product, isLoading] = useProduct()
    const { name, price, category, abv, ml, description, images } = product
    const { packSize, quantity, packSizeHandler, quantityHandler, total } =
        useProductSelection(price)

    return (
        <>
            <h1>{name}</h1>
            <p>{description}</p>
            <p>Category: {category}</p>
            <p>ABV(Alcohol by Volumen): {abv}%</p>
            <p>Bottle size: {parseFloat(ml).toFixed(0)} ml</p>
            <label htmlFor="packSize">Pack Size</label>
            <select id="packSize" onChange={packSizeHandler}>
                {Object.entries(price).map(([key, { unit, value }]) => (
                    <option value={key} key={key}>
                        {unit} - ${value}
                    </option>
                ))}
            </select>
            <label htmlFor="quantity">Quantity</label>
            <select id="quantity" onChange={quantityHandler}>
                {[...Array(10)].map((_, i) => (
                    <option key={i + 1}>{i + 1}</option>
                ))}
            </select>
            <p>{`Total: $${total}`}</p>
            {/* <button onClick={} >Add to cart</button> */}

            <img
                width={'25%'}
                srcSet={`${images.phone} 360w, ${images.tablet} 720w, ${images.desktop} 1080w`}
                sizes={`(max-width: 600px) 360px, (max-width: 1024px) 720px, 1080px`}
            />
        </>
    )
}
