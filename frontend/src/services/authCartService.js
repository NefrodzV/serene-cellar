import { API_URL } from '../config'
import { CART_KEY } from '../config'
export async function fetchCart() {
  const res = await fetch(`${API_URL}/me/cart`, {
    credentials: 'include',
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data || 'Fetch cart failed')
  }

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
  const res = await fetch(`${API_URL}/me/cart`, options)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data || 'Failed to add item to remote cart')
  }

  return data
}

export async function deleteItem(itemId) {
  const res = await fetch(`${API_URL}/me/cart/${itemId}`, {
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
  const res = await fetch(`${API_URL}/me/cart/${itemId}`, options)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data || 'Failed to update item from remote cart')
  }
  return data
}

export async function syncCart() {
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
    body: JSON.stringify({
      // On pass the fields I need
      items: items.map((it) => ({
        priceId: it.priceId,
        quantity: it.quantity,
      })),
    }),
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.errors || 'Failed to syncronize cart')
  }
  // Remove the local items
  localStorage.removeItem(CART_KEY)
  return data ?? null
}
