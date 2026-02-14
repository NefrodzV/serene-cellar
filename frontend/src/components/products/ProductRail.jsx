import React from 'react'
import { ProductCard } from './ProductCard'
import { Link } from 'react-router-dom'
import { Thumbnail, Title, Price, Card } from '../ui'
import { API_URL } from '../../config'

export function ProductRail({ products }) {
    return (
        <ul className="product-rail">
            {products?.map((product) => (
                <Card key={product?.id} as={Link} to={`/shop/${product?.id}`}>
                    <article className="product-item">
                        <div className="image-wrapper image-wrapper--product-grid">
                            <Thumbnail
                                variant="grid"
                                images={{
                                    150: `${API_URL}/${product.images[150]}`,
                                    300: `${API_URL}/${product.images[300]}`,
                                    450: `${API_URL}/${product.images[450]}`,
                                }}
                                alt={`${product.name} thumbnail`}
                            />
                        </div>

                        <Title as="h2" variant="card">
                            {product.name}
                        </Title>
                        <Price variant="card" price={product.price} />
                    </article>
                </Card>
            ))}
        </ul>
    )
}
