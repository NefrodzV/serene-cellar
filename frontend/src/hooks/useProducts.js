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
        // This is duplicating products in set
        for (let i = 0; i < products.length; i++) {
          const product = products[i]
          setProductsByCategory((prev) => {
            const map = new Map(prev)
            const categoryExists = map.has(product.category)
            if (categoryExists) {
              const existingCategorizedProducts =
                map.get(product.category) || []

              map.set(product.category, [
                ...existingCategorizedProducts,
                product,
              ])
            } else {
              map.set(product.category, [product])
            }
            map.set('all', [...map.get('all'), product])
            return map
          })
        }
      } catch (error) {
        console.error(error)
      }
    })()

    return () => abortController.abort()
  }, [])

  useEffect(() => {
    setProducts(productsByCategory.get(category))
  }, [category, productsByCategory])

  return { products, isLoading, setCategory }
}
