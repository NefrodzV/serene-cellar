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

  return data.cart
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

  return data.cart
}

export function addItemToLocalCart(item) {
  const localCart = JSON.parse(localStorage.getItem(CART_KEY)) || []

  // Finding if item already exists and updating the quantity
  const existingItem = localCart.find(
    (i) => i.productId === item.productId && i.unitType === item.unitType
  )

  if (existingItem) {
    existingItem.quantity += item.quantity
  } else {
    localCart.push({
      id: uuidv4(),
      ...item,
    })
  }

  localStorage.setItem(CART_KEY, JSON.stringify(localCart))
  return { items: localCart }
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
  return data.cart
}

export function deleteItemFromLocalCart(item) {
  const localCart = JSON.parse(localStorage.getItem(CART_KEY)) || []
  const updatedCart = localCart.filter((i) => !(i.id === item.id))
  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart))
  return updatedCart
}

export async function updateItemFromRemoteCart(item) {
  const { itemId, quantity } = item
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
  return data.cart
}

export function updateItemFromLocalCart(item) {
  const { slug, quantity, unitType } = item
  const items = JSON.parse(localStorage.getItem(CART_KEY)) || []
  const updateItem = items.find((i) => i.id === item.id)
  updateItem.quantity = quantity
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  return items
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
  return data.cart ?? null
}

export function localCartHasItems() {
  const items = JSON.parse(localStorage.getItem(CART_KEY)) || []
  return items.length > 0
}
