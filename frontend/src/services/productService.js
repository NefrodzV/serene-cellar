const apiUrl = import.meta.env.VITE_SERENE_CELLAR_API_URL
export async function getProducts() {
  const response = await fetch(apiUrl + '/products', {
    credentials: 'include',
  })
  const data = await response.json()
  if (!response.ok) {
    return new Error('Loading products failed:'.data)
  }
  return data
}
