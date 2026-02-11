import { useEffect, useRef, useState } from 'react'
import { getProducts, getProductsWithFilter } from '../services/productService'
import { fetchWithRetries } from '../utils'
export function useProducts() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState('')
    const [message, setMessage] = useState(null)

    const pendingRef = useRef(null)
    const requestIdRef = useRef(0)
    const itemsExiting = useRef(new Set())

    console.log(filter)
    useEffect(() => {
        const controller = new AbortController()
        ;(async () => {
            try {
                if (products.length === 0) setIsLoading(true)

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
                if (filter && products.length > 0) {
                    requestAnimationFrame(() => {
                        setProducts((prev) =>
                            prev?.map((p) => {
                                if (p.typeOfAlcohol !== filter) {
                                    itemsExiting.current.add(p?.id)
                                    return { ...p, status: 'exit' }
                                }
                                return p
                            })
                        )
                    })
                    requestIdRef.current = ++requestIdRef.current
                    pendingRef.current = data
                    return
                }

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
                if (e.name === 'AbortError') return
                console.error(e)
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

    function onExit(id) {
        if (itemsExiting?.current.size === 0) {
            // If all items have exited append the new list
            const newProducts = pendingRef.current
            // Check items existence and append new one
            setProducts((prev) =>
                newProducts.map((p) => {
                    const found = prev.find((op) => op.id === p.id)
                    return found ?? { ...p, status: 'enter' }
                })
            )

            // Then begin the idle transition

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setProducts((prev) =>
                        prev.map((p) =>
                            p.status === 'enter' ? { ...p, status: 'idle' } : p
                        )
                    )
                })
            })

            pendingRef.current = null
        } else {
            itemsExiting?.current.delete(id)
                ? console.log('Filtered out item with id: ', id)
                : null
            setProducts((prev) => prev.filter((product) => product.id !== id))
        }
    }

    function onDelete(id) {
        // setProducts((prev) => prev.filter((product) => product.id !== id))
    }

    return {
        products,
        message,
        isLoading,
        filter,
        onFilter,
        onExit,
        onDelete,
    }
}
