import { API_URL } from '../config'

export async function getProducts(signal) {
  const response = await fetch(API_URL + '/products', {
    signal,
  })
  if (!response.ok) {
    const error = new Error(
      'Loading products failed status code:' + response.status
    )
    error.status = response.status
    throw error
  }
  const data = await response.json()
  return data
}

export async function getProductsWithFilter(types, signal) {
  const res = await fetch(`${API_URL}/products?types=${types}`, {
    signal,
  })
  if (!res.ok) throw new Error('Loading products with type failed: ', res)
  const data = await res.json()
  return data
}

export async function getRelatedProducts(productId, signal) {
  const res = await fetch(`${API_URL}/products/${productId}/related`, {
    signal,
  })
  if (!res.ok) {
    const error = new Error('Error loading related products')
    error.status = res.status
    throw new Error(error)
  }
  const data = await res.json()
  return data
}
