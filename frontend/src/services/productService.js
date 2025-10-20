const apiUrl = import.meta.env.VITE_SERENE_CELLAR_API_URL
export async function getProducts(abortController) {
  const response = await fetch(apiUrl + '/products', {
    credentials: 'include',
    signal: abortController?.signal,
  })
  const data = await response.json()
  if (!response.ok) {
    return new Error('Loading products failed:', data)
  }
  return data
}

export async function getProductsWithFilter(filter) {
  let typeQuery = null
  if (Array.isArray(filter)) {
    typeQuery = filter.join(',')
  } else {
    typeQuery = filter.trim()
  }
  const res = await fetch(`${apiUrl}/products?types=${typeQuery}`)
  const data = await res.json()
  if (!res.ok) throw new Error('Loading products with type failed')
  return data
}
