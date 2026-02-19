import React, { useState } from 'react'
import { Tag, Form } from '../ui'
import { Heading } from '../ui/Heading'
import { ProductCard } from './ProductCard'
import { Skeleton } from '../loading/Skeleton'
import { ProductGridSkeleton } from '../loading/ProductGridSkeleton'
import { FilterSkeleton } from '../loading/FilterSkeleton'

export function ProductGrid({
    products,
    categories,
    filter,
    isLoading,
    onFilter,
    onExit,
}) {
    return (
        <section className="product-container">
            {isLoading ? (
                <>
                    <Skeleton variant="title" />
                    <FilterSkeleton />
                    <ProductGridSkeleton />
                </>
            ) : (
                <>
                    <Heading>Products</Heading>
                    <Form className="filters" aria-label="Product filters">
                        {categories?.map((type) => (
                            <Tag
                                key={type}
                                id={`alcohol-${type}`}
                                value={type}
                                isActive={type === filter}
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
                            return (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    onExit={onExit}
                                />
                            )
                        })}
                    </ul>
                </>
            )}
        </section>
    )
}
