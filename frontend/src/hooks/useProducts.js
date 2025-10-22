import { useEffect, useState } from 'react'
import { useLoading } from './useLoading'
import { getProducts, getProductsWithFilter } from '../services/productService'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [alcoholType, setAlcoholType] = useState([])
  useEffect(() => {
    const abortController = new AbortController()
    ;(async () => {
      try {
        let data = null
        if (!alcoholType.length) {
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
        const data = await getProductsWithFilter(alcoholType)
        console.log(`data with filters`, data)
        setProducts(data)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [alcoholType])
  function onFilterChange(e) {
    setAlcoholType((t) => {
      if (t.find((i) => i === e.target.value)) {
        return t.filter((i) => i !== e.target.value)
      } else {
        return [...t, e.target.value]
      }
    })
  }

  return { products, isLoading, onFilterChange }
}
