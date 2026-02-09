import React from 'react'
import { ProductGrid } from '../components'
import { Link } from 'react-router-dom'
import { useProducts, useCategories } from '../hooks'
import { Spinner } from '../components/ui'

export function ShopPage() {
    const { products, isLoading, filter, message, onFilter } = useProducts()

    const filterProducts = (products, filters) => {
        if (!products.length) return products
        if (filters.size) {
            return products.map((product) => {
                if (filters.has(product.typeOfAlcohol)) {
                    return {
                        data: { ...product },
                        visible: true,
                        exit: false,
                    }
                } else {
                    return { data: { ...product }, visible: true, exit: true }
                }
            })
        }
        return products.map((product) => ({
            data: { ...product },
            visible: true,
            exit: false,
        }))
    }
    const { categories } = useCategories()

    return (
        <div className="shop-page">
            {/* <ProductGrid
                products={products}
                categories={categories}
                onFilter={onFilter}
            /> */}
            {isLoading ? (
                <Spinner message={message} />
            ) : (
                <ProductGrid
                    products={products}
                    categories={categories}
                    onFilter={onFilter}
                />
            )}
        </div>
    )
}
