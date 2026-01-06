import { useEffect, useState } from 'react'
import { API_URL } from '../config'
import { fetchWithRetries } from '../../utils'

export function useCategories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const controller = new AbortController()
    ;(async () => {
      try {
        const data = await fetchWithRetries(
          () => getProductCategories(controller.signal),
          { signal: controller.signal }
        )
        setCategories(data?.categories)
      } catch (e) {
        if (e.name !== 'AbortError') console.error(e)
      }
    })()

    return () => {
      controller.abort()
    }
  }, [])

  async function getProductCategories(signal) {
    const res = await fetch(`${API_URL}/products/categories`, {
      signal,
    })

    if (!res.ok) {
      const error = new Error(
        'Product categories fetch failed status:',
        res.status
      )
      error.status = res.status
      throw error
    }
    return await res.json()
  }

  return {
    categories,
  }
}
