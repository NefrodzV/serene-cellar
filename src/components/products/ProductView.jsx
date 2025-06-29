import React, { useState } from "react";
import { useProduct } from "../../hooks";

export function ProductView() {
    const [product, isLoading] = useProduct()
    const { name, price, category, abv, ml, description,  images } = product
    const [packSize, setPackSize] = useState(Object.keys(price).at(0))
    const [quantity, setQuantity] = useState(1)
    function packSizeHandler(e) {
        setPackSize(e.target.value)
    }
    function quantityHandler(e) {
        setQuantity(e.target.value)
    }

    return (
    <>
        <h1>{name}</h1>
        <p>{description}</p>
        <label htmlFor="packSize">Pack Size</label>
        <select id="packSize" onChange={packSizeHandler}>
            {Object.entries(price).map(([key, {unit , value}]) => (
                <option value={key} key={key}>{unit} - ${value}</option>
            ))}
        </select>
        <label htmlFor="quantity">Quantity</label>
        <select id="quantity" onChange={quantityHandler}>
            {[...Array(10)].map((_, i) => (
                <option key={i + 1}>{i + 1}</option>
            ))}
        </select>
        <p>{`Total: $${Number(price[packSize]?.value) * Number(quantity)}` }</p>
        
    <img    
    width={'25%'}
    srcSet={`${images.phone} 360w, ${images.tablet} 720w, ${images.desktop} 1080w`}
    sizes={`(max-width: 600px) 360px, (max-width: 1024px) 720px, 1080px`}
    /> 
    </>
        
   
    )
}