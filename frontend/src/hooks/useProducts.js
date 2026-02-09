import { useEffect, useState } from 'react'
import { getProducts, getProductsWithFilter } from '../services/productService'
import { fetchWithRetries } from '../utils'
export function useProducts() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState('')
    const [message, setMessage] = useState(null)

    useEffect(() => {
        const controller = new AbortController()
        ;(async () => {
            try {
                setIsLoading(true)
                const data = await fetchWithRetries(
                    () => {
                        if (filter) {
                            console.log('has filter getting filtered products')
                            return getProductsWithFilter(
                                filter,
                                controller.signal
                            )
                        } else {
                            console.log('has no filter getting products')
                            return getProducts(controller.signal)
                        }
                    },
                    {
                        signal: controller.signal,
                        onRetry: (attempts) => {
                            if (attempts >= 1) {
                                setMessage('Waking up server...')
                            }
                        },
                    }
                )
                // Format data with exit, enter and idle

                const formattedData = data.map((p) => ({
                    ...p,
                    status: 'enter',
                }))
                setProducts(formattedData)

                // After settign that data do the idle or normal animation state
                requestAnimationFrame(() => {
                    setProducts((prev) =>
                        prev.map((p) => ({ ...p, status: 'idle' }))
                    )
                })
            } catch (e) {
                if (e.name !== 'AbortError') return console.error(e)
                setProducts([])
            } finally {
                if (!controller.signal.aborted) setIsLoading(false)
            }
        })()
        return () => {
            controller.abort()
        }
    }, [filter])

    function onFilter(filter) {
        setFilter((prev) => (prev === filter ? '' : filter))
    }

    function removeProduct(id) {
        setProducts((prev) => prev.filter((product) => product.id !== id))
    }

    return {
        products,
        message,
        isLoading,
        filter,
        onFilter,
        removeProduct,
    }
}
