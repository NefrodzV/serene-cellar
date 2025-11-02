import { CART_KEY } from '../config'
import { v4 as uuidv4 } from 'uuid'
import { API_URL } from '../config'
export async function addItem(item, quantity) {
  const localCartItems = getLocalCart()

  // Finding if item already exists and updating the quantity
  const itemIndex = localCartItems.findIndex((i) => i.priceId === item.priceId)
  if (itemIndex !== -1) {
    const itemFound = localCartItems[itemIndex]
    localCartItems[itemIndex] = {
      ...itemFound,
      quantity: itemFound.quantity + quantity,
    }
  } else {
    localCartItems.push({
      ...item,
      id: uuidv4(),
      quantity,
    })
  }

  localStorage.setItem(CART_KEY, JSON.stringify(localCartItems))
  const validatedCart = await validateLocalCartItems(localCartItems)
  return validatedCart
}

export async function deleteItem(itemId) {
  const items = getLocalCart()
  const itemsUpdated = items.filter((i) => !(i.id === itemId))
  localStorage.setItem(CART_KEY, JSON.stringify(itemsUpdated))

  if (itemsUpdated.length) {
    const data = await validateLocalCartItems(itemsUpdated)
    return data ?? null
  } else {
    return null
  }
}

export async function updateItem(itemId, quantity) {
  const items = getLocalCart()
  const itemIndex = items.findIndex((i) => i.id === itemId)
  if (itemIndex === -1)
    throw new Error('No index found for this item in local storage')
  const itemFound = items[itemIndex]
  items[itemIndex] = { ...itemFound, quantity: quantity }
  localStorage.setItem(CART_KEY, JSON.stringify(items))

  const data = await validateLocalCartItems(items)
  return data ?? null
}

export function getLocalCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || []
}

export function localCartHasItems() {
  const items = localStorage.getItem(CART_KEY) || []
  return items.length > 0
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
