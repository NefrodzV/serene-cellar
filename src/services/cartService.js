import { API_URL } from '../config'

const CART_KEY = CART_KEY

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
    const existing = localCart.find(
        (i) => i.productId === item.productId && i.unitType === item.unitType
    )
    if (existing) {
        existing.quantity = item.quantity
    } else {
        localCart.push(item)
    }
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
    const localCart = JSON.parse(localStorage.getItem(CART_KEY))
    const updateCart = localCart.filter(
        (i) => !(i.slug === item.slug && i.unitType === item.unitType)
    )
    localStorage.setItem(CART_KEY, JSON.stringify(updateCart))
    return updateCart
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
    const items = JSON.parse(localStorage.getItem(CART_KEY))
    const item = items.find((i) => i.slug === slug && i.unitType === unitType)
    item.quantity = quantity
    localStorage.setItem(CART_KEY, JSON.stringify(items))
    return items
}
