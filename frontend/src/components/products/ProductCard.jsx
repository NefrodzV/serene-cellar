import React, { useState, useEffect } from 'react'
import { Card } from '../ui'
import { Link } from 'react-router-dom'
import { Title, Thumbnail, Price } from '../ui'
import { API_URL } from '../../config'
export function ProductCard({ product, onExit }) {
    const minPrice = Math.min(
        ...product.variants.map((variant) => variant.price)
    )

    return (
        <Card
            className={product.status}
            as={Link}
            to={`/shop/${product?.id}`}
            onTransitionEnd={(e) => {
                if (e.target !== e.currentTarget) return
                if (product.status === 'exit') onExit(product.id)
            }}
        >
            <article className="product-item">
                <div className="image-wrapper image-wrapper--product-grid">
                    <Thumbnail
                        variant="grid"
                        images={{
                            150: `${API_URL}/${product.images.thumbnail[150]}`,
                            300: `${API_URL}/${product.images.thumbnail[300]}`,
                            450: `${API_URL}/${product.images.thumbnail[450]}`,
                        }}
                        alt={`${product.name} thumbnail`}
                    />
                </div>

                <Title as="h2" variant="card">
                    {product.name}
                </Title>
                <Price variant="card" price={minPrice} />
            </article>
        </Card>
    )
}
