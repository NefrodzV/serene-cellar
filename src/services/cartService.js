import { API_URL } from '../config'
import { v4 as uuidv4 } from 'uuid'
const CART_KEY = 'cart'

export async function fetchCart(cartId) {
    const res = await fetch(`${API_URL}/cart/${cartId}`)
    const data = await res.json()

    if (!res.ok) {
        throw new Error(data || 'Fetch cart failed')
    }

    return data.cart
}

export async function addItemToRemoteCart(item, cartId) {
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    }
    const res = await fetch(`${API_URL}/cart/${cartId}`, options)
    const data = await res.json()
    if (!res.ok) {
        throw new Error(data || 'Failed to add item to remote cart')
    }

    return data.cart
}

export function addItemToLocalCart(item) {
    const localCart = JSON.parse(localStorage.getItem(CART_KEY)) || []
    localCart.push({
        id: uuidv4(),
        ...item,
    })
    localStorage.setItem(CART_KEY, JSON.stringify(localCart))
    return localCart
}

export async function deleteItemFromRemoteCart(item, cartId) {
    const res = await fetch(`${API_URL}/cart/${cartId}/items/${item.id}`, {
        method: 'DELETE',
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
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
    }
    const res = await fetch(
        `${API_URL}/cart/${cartId}/items/${itemId}`,
        options
    )
    const data = res.json()
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
