import React from 'react'
import { ProductGrid } from '../components'
import { useProducts, useCategories } from '../hooks'
import { Spinner } from '../components/ui'

export function ShopPage() {
    const { products, isLoading, filter, message, onFilter, onExit } =
        useProducts()
    const { categories } = useCategories()

    return (
        <div className="shop-page">
            {isLoading ? (
                <Spinner message={message} />
            ) : (
                <ProductGrid
                    products={products}
                    categories={categories}
                    onFilter={onFilter}
                    onExit={onExit}
                    filter={filter}
                />
            )}
        </div>
    )
}
