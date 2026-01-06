import { useEffect, useState } from 'react'
import { getProducts, getProductsWithFilter } from '../services/productService'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState(new Set())

  useEffect(() => {
    const controller = new AbortController()
    ;(async () => {
      try {
        setIsLoading(true)
        let data = []
        if (filters.size) {
          data = await getProductsWithFilter(
            Array.from(filters).join(','),
            controller
          )
        } else {
          data = await getProducts(controller)
        }
        setProducts(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    })()
    return () => {
      controller.abort()
    }
  }, [filters])

  function onFilterChange(e) {
    const filter = e.target.value
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

  return { products, isLoading, filters, onFilterChange, removeProduct }
}
