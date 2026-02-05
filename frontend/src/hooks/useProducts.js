import { useEffect, useState } from 'react'
import { getProducts, getProductsWithFilter } from '../services/productService'
import { fetchWithRetries } from '../utils'
export function useProducts() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState(new Set())
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    ;(async () => {
      try {
        setIsLoading(true)
        const data = await fetchWithRetries(
          () => {
            if (filters?.size) {
              return getProductsWithFilter(
                Array.from(filters).join(','),
                controller.signal
              )
            } else {
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
        setProducts(data)
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
  }, [filters])

  function updateFilter(filter) {
    setFilters((s) => {
      const us = new Set(s)
      if (us.has(filter)) us.delete(filter)
      else us.add(filter)
      return us
    })
  }

  function removeProduct(id) {
    setProducts((prev) => prev.filter((product) => product.id !== id))
  }

  return {
    products,
    message,
    isLoading,
    filters,
    updateFilter,
    removeProduct,
  }
}
