const apiUrl = import.meta.env.VITE_SERENE_BACKEND

export async function getProducts(signal) {
  const response = await fetch(apiUrl + '/products', {
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
  const res = await fetch(`${apiUrl}/products?types=${types}`, {
    signal,
  })
  const data = await res.json()
  if (!res.ok) throw new Error('Loading products with type failed')
  return data
}
