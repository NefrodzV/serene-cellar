import { useEffect, useState } from 'react'
import { useLoading } from './useLoading'
import { getProducts } from '../services/productService'

export function useProducts() {
  const [products, setProducts] = useState([])
  const isLoading = useLoading(products)

  useEffect(() => {
    ;(async () => {
      try {
        const products = await getProducts()
        setProducts(products)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  return [products, isLoading]
}
