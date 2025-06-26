import React from "react";
export default function ProductCard({product}) {
    console.log(product)
    return <a href={`/shop/${product.id}`}>{product.name}</a>
}