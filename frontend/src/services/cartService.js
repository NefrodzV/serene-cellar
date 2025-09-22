import { API_URL } from '../config'
import { v4 as uuidv4 } from 'uuid'
const CART_KEY = 'cart'

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

export async function addItemToRemoteCart(item) {
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',

    body: JSON.stringify({ item }),
  }
  const res = await fetch(`${API_URL}/me/cart`, options)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data || 'Failed to add item to remote cart')
  }

  return data
}

export async function addItemToLocalCart(productId, priceId, quantity) {
  const localCartItems = JSON.parse(localStorage.getItem(CART_KEY)) || []

  // Finding if item already exists and updating the quantity
  const itemIndex = localCartItems.findIndex(
    (i) => i.productId === productId && i.priceId === priceId
  )
  if (itemIndex !== -1) {
    const itemFound = localCartItems[itemIndex]
    localCartItems[itemIndex] = {
      ...itemFound,
      quantity: itemFound.quantity + quantity,
    }
  } else {
    localCartItems.push({
      id: uuidv4(),
      productId,
      priceId,
      quantity,
    })
  }

  localStorage.setItem(CART_KEY, JSON.stringify(localCartItems))
  const validatedCart = await validateLocalCartItems(localCartItems)
  return validatedCart
}

export async function deleteItemFromRemoteCart(item) {
  const res = await fetch(`${API_URL}/me/cart/${item.id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data || 'Failed to delete item from remote cart')
  }
  return data
}

export function deleteItemFromLocalCart(id) {
  const localCart = JSON.parse(localStorage.getItem(CART_KEY)) || []
  const updatedCart = localCart.filter((i) => !(i.id === id))
  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart))
  return updatedCart
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
  const localCart = JSON.parse(localStorage.getItem(CART_KEY))
  if (localCart.length === 0) {
    return null
  }

  const res = await fetch(`${API_URL}/me/cart/sync`, {
    method: 'post',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items: localCart }),
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
    consolelog(data)
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
