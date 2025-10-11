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
