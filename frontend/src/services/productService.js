const apiUrl = import.meta.env.VITE_SERENE_BACKEND

export async function getProducts(abortController) {
  const response = await fetch(apiUrl + '/products', {
    credentials: 'include',
    signal: abortController?.signal,
  })

  console.log('response object')
  console.log(response)
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

export async function getProductsWithFilter(types, controller) {
  const res = await fetch(`${apiUrl}/products?types=${types}`, {
    signal: controller?.signal,
  })
  const data = await res.json()
  if (!res.ok) throw new Error('Loading products with type failed')
  return data
}
