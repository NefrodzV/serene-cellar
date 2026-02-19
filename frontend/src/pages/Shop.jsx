import React from 'react'
import { ProductGrid } from '../components'
import { useProducts, useCategories } from '../hooks'

export function ShopPage() {
    const { products, isLoading, filter, message, onFilter, onExit } =
        useProducts()
    const { categories } = useCategories()

    return (
        <div className="shop-page">
            <ProductGrid
                products={products}
                categories={categories}
                isLoading={isLoading}
                onFilter={onFilter}
                onExit={onExit}
                filter={filter}
            />
        </div>
    )
}
