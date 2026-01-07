import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import { fetchWithRetries } from '../utils'
export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState(null)
  useEffect(() => {
    const controller = new AbortController()
    ;(async () => {
      try {
        const data = await fetchWithRetries(
          () => getProductWithId(id, controller.signal),
          {
            signal: controller.signal,
            onRetry: (attemp) => {
              if (attemp >= 1) {
                setMessage('Waking server up...')
              }
            },
          }
        )

        setProduct(data)
      } catch (e) {
        if (e.name === 'AbortError') return
        console.error(e)
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    })()

    async function getProductWithId(id, signal) {
      const res = await fetch(`${API_URL}/products/${id}`, { signal })
      if (!res.ok) {
        const error = new Error(
          'Failed to get product with id status:',
          res.status
        )
        error.status = res.status
        throw error
      }
      const data = await res.json()
      return data
    }
    return () => {
      controller.abort()
    }
  }, [id])

  return { product, isLoading, message }
}
