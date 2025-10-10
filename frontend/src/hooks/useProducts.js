import { useEffect, useState } from 'react'
import { useLoading } from './useLoading'
import { getProducts } from '../services/productService'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [productByCategory, setProductByCategory] = useState(new Map())
  const isLoading = useLoading(products)

  useEffect(() => {
    ;(async () => {
      try {
        const products = await getProducts()
        setProducts(products)
        // This is duplicating products in set
        for (let i = 0; i < products.length; i++) {
          const product = products[i]
          setProductByCategory((prev) => {
            const categoryExists = prev.has(product.category)
            if (categoryExists) {
              const existingCategorizedProducts =
                prev.get(product.category) || []
              existingCategorizedProducts.push(product)
              prev.set(product.category, existingCategorizedProducts)
              return prev
            } else {
              prev.set(product.category, [product])
              return prev
            }
          })
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  useEffect(() => {
    console.log(productByCategory)
  })

  return { products, isLoading }
}
