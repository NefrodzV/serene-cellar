import { useEffect, useState } from 'react'
import { getRelatedProducts } from '../services/productService'

export function useRelatedProducts(productId) {
  const [products, setProducts] = useState([])
  useEffect(() => {
    if (!productId) return
    const controller = new AbortController()
    ;(async () => {
      try {
        const data = await getRelatedProducts(productId, controller.signal)
        setProducts(data.products)
      } catch (e) {
        if (e.name === 'AbortError') return
        console.error(e)
      }
    })()
    return () => {
      controller.abort()
    }
  }, [productId])

  return {
    relatedProducts: products,
  }
}
