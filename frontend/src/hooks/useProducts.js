import { useEffect, useState } from 'react'
import { useLoading } from './useLoading'
import { getProducts } from '../services/productService'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [productsByCategory, setProductsByCategory] = useState(
    new Map([['all', []]])
  )
  const isLoading = useLoading(products)
  const [category, setCategory] = useState('all')
  useEffect(() => {
    const abortController = new AbortController()
    ;(async () => {
      try {
        const products = await getProducts(abortController)
        setProducts(products)
      } catch (error) {
        console.error(error)
      }
    })()

    return () => abortController.abort()
  }, [])

  return { products, isLoading, setCategory }
}
