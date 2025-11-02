import { API_URL } from '../config'
import { v4 as uuidv4 } from 'uuid'
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

export async function addItemToRemoteCart(priceId, quantity) {
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

export async function addItemToLocalCart(priceId, quantity) {
  const localCartItems = JSON.parse(localStorage.getItem(CART_KEY)) || []

  // Finding if item already exists and updating the quantity
  const itemIndex = localCartItems.findIndex((i) => i.priceId === priceId)
  if (itemIndex !== -1) {
    const itemFound = localCartItems[itemIndex]
    localCartItems[itemIndex] = {
      ...itemFound,
      quantity: itemFound.quantity + quantity,
    }
  } else {
    localCartItems.push({
      id: uuidv4(),
      priceId,
      quantity,
    })
  }

  localStorage.setItem(CART_KEY, JSON.stringify(localCartItems))
  const validatedCart = await validateLocalCartItems(localCartItems)
  return validatedCart
}

export async function deleteItemFromRemoteCart(itemId) {
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

export async function deleteItemFromLocalCart(itemId) {
  const items = JSON.parse(localStorage.getItem(CART_KEY)) || []
  const itemsUpdated = items.filter((i) => !(i.id === itemId))
  localStorage.setItem(CART_KEY, JSON.stringify(itemsUpdated))

  if (itemsUpdated.length) {
    const data = await validateLocalCartItems(itemsUpdated)
    return data ?? null
  } else {
    return null
  }
}

export async function updateItemFromRemoteCart(itemId, quantity) {
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

export async function updateItemFromLocalCart(itemId, quantity) {
  const items = await getLocalCart()
  const itemIndex = items.findIndex((i) => i.id === itemId)
  if (itemIndex === -1)
    throw new Error('No index found for this item in local storage')
  const itemFound = items[itemIndex]
  items[itemIndex] = { ...itemFound, quantity: quantity }
  localStorage.setItem(CART_KEY, JSON.stringify(items))

  const data = await validateLocalCartItems(items)
  return data ?? null
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

export async function validateLocalCartItems(items) {
  const res = await fetch(`${API_URL}/me/cart/validate`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error)
  }
  return data ?? null
}

export async function getLocalCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || []
}

export function localCartHasItems() {
  const items = localStorage.getItem(CART_KEY) || []
  return items.length > 0
}
