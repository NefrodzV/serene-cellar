import { API_URL, CART_KEY } from '../config'
import { getLocalCart } from './localCartService'
export async function fetchCart(signal) {
  const res = await fetch(`${API_URL}/me/cart`, {
    credentials: 'include',
    signal,
  })

  if (res.status === 401) return null
  if (!res.ok) {
    const error = new Error('Fetch cart failed with status:' + res.status)
    error.status = res.status
    throw error
  }
  const data = await res.json()
  return data
}

export async function addItem(priceId, quantity) {
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ priceId, quantity }),
  }
  const res = await fetch(`${API_URL}/me/cart/items`, options)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data || 'Failed to add item to remote cart')
  }

  return data
}

export async function deleteItem(itemId) {
  const res = await fetch(`${API_URL}/me/cart/items/${itemId}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data || 'Failed to delete item from remote cart')
  }
  return data
}

export async function updateItem(itemId, quantity) {
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ quantity }),
  }
  const res = await fetch(`${API_URL}/me/cart/items/${itemId}`, options)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data || 'Failed to update item from remote cart')
  }
  return data
}

export async function syncCart(signal) {
  const items = await getLocalCart()
  if (items.length === 0) {
    return null
  }

  const res = await fetch(`${API_URL}/me/cart/sync`, {
    method: 'post',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: signal,
    body: JSON.stringify({
      // On pass the fields I need
      items: items.map((it) => ({
        priceId: it.priceId,
        quantity: it.quantity,
      })),
    }),
  })
  if (res.status === 401) return null
  if (!res.ok) {
    const error = new Error(
      'Failed to syncronize cart with status:',
      res.status
    )
    error.status = res.arrayBuffer.status
    throw error
  }
  const data = await res.json()
  // Remove the local items
  localStorage.removeItem(CART_KEY)
  return data ?? null
}
