import { useEffect, useState } from 'react'
import { API_URL } from '../config'

export function useCategories() {
  const [alcoholTypes, setAlcoholTypes] = useState([])

  useEffect(() => {
    ;(async () => {
      const data = await getProductCategories()
      setAlcoholTypes(data.categories)
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
    alcoholTypes,
  }
}
