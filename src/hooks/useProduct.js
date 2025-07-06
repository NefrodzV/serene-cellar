import { useState, useEffect } from 'react'
import { useLoading } from './useLoading'
import { API_URL } from '../config'
export function useProduct(slug, isEditing) {
    const [product, setProduct] = useState(null)
    const isLoading = useLoading(product)

    useEffect(() => {
        async function getProductWithSlug() {
            try {
                const response = await fetch(
                    `${API_URL}/products/${slug.trim()}`
                )
                const data = await response.json()

                if (!response.ok) {
                    return console.error('Error response:', data)
                }
                setProduct(data)
            } catch (e) {
                console.error('GET product with slug error:', e)
            }
        }

        if (!product) getProductWithSlug()
        if (isEditing) getProductWithSlug()
    }, [slug, isEditing])

    return [product, isLoading]
}
