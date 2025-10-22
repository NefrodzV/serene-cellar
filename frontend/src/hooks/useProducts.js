import { useEffect, useState } from 'react'
import { useLoading } from './useLoading'
import { getProducts, getProductsWithFilter } from '../services/productService'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState(new Set())
  useEffect(() => {
    const abortController = new AbortController()
    ;(async () => {
      try {
        let data = null
        if (!filters.length) {
          data = await getProducts(abortController)
        }

        setProducts(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    })()

    return () => abortController.abort()
  }, [])

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      try {
        const data = await getProductsWithFilter(Array.from(filters).join(','))
        console.log(`data with filters`, data)
        setProducts(data)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    })()
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

  return { products, isLoading, filters, onFilterChange }
}
