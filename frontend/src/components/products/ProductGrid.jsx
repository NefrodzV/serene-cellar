import React, { useState } from 'react'
import { Tag, Form } from '../ui'
import { Heading } from '../ui/Heading'
import { ProductCard } from './ProductCard'

export function ProductGrid({ products, categories, onFilter }) {
    return (
        <section className="product-container">
            <Heading>Products</Heading>
            <Form className="filters" aria-label="Product filters">
                {categories?.map((type) => (
                    <Tag
                        key={type}
                        id={`alcohol-${type}`}
                        value={type}
                        onChange={(e) => {
                            onFilter(e.target.value)
                        }}
                    >
                        {type}
                    </Tag>
                ))}
            </Form>

            <ul className="product-grid">
                {products.map((p) => {
                    return <ProductCard key={p.id} product={p} />
                })}
            </ul>
        </section>
    )
}
