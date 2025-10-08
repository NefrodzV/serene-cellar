import { useEffect, useState } from 'react'
import { API_URL } from '../config'

export function useCategories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    ;(async () => {
      if (!categories || categories.length === 0) {
        const data = await getProductCategories()
        setCategories(data.categories)
      }
    })()
  }, [])
  async function getProductCategories() {
    try {
      const res = await fetch(`${API_URL}/products/categories`)
      if (!res.ok) {
        throw new Error('Error fetching product categories')
      }
      return await res.json()
    } catch (e) {
      console.error(e)
    }
  }

  return {
    categories,
  }
}
