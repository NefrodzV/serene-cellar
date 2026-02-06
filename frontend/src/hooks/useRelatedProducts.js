import { useEffect, useState } from 'react'
import { getRelatedProducts } from '../services/productService'

export function useRelatedProducts(productId) {
  const [products, setProducts] = useState([])
  useEffect(() => {
    if (!productId) return
    ;(async () => {
      try {
        const data = await getRelatedProducts(productId)
        setProducts(data.products)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [productId])

  console.log(products)
  return {
    relatedProducts: products,
  }
}
