import React from 'react'
import { Link } from 'react-router-dom'
import { Title, Thumbnail, PriceTag } from '../ui'
import { API_URL } from '../../config'
import { ProductTitle } from '../product/ProductTitle'
import { ProductPrice } from '../product/ProductPrice'

export function ProductItem({ productName, price, images }) {
    return (
        <article className="product-item">
            <Thumbnail
                images={{
                    150: `${API_URL}/${images[150]}`,
                    300: `${API_URL}/${images[300]}`,
                    450: `${API_URL}/${images[450]}`,
                }}
                alt={`${productName} thumbnail`}
            />
            <ProductTitle as="h2" classes={'text-center'} variant="card">
                {productName}
            </ProductTitle>
            <ProductPrice variant="card" price={price} />
        </article>
    )
}
