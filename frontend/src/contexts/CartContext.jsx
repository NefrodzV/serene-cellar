import { createContext, useEffect, useState } from 'react'
import { useMessages, useUser } from '../hooks'
import React from 'react'
import {
  addItemToLocalCart,
  addItemToRemoteCart,
  deleteItemFromLocalCart,
  deleteItemFromRemoteCart,
  updateItemFromLocalCart,
  updateItemFromRemoteCart,
  fetchCart,
  localCartHasItems,
  syncCart,
} from '../services/cartService'

export const CartContext = createContext()

export function CartProvider({ children }) {
  const { isAuthenticated } = useUser()

  // Update this to call the functions of the cartService
  const [cartItems, setCartItems] = useState(() => {
    if (!isAuthenticated) {
      try {
        const localCart = localStorage.getItem('cart')
        return localCart ? JSON.parse(localCart) : []
      } catch {
        return []
      }
    }

    return []
  })
  const { sendMessage } = useMessages()

  const total = cartItems?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  useEffect(() => {
    async function loadCart() {
      try {
        let data = null
        if (localCartHasItems()) {
          data = await syncCart()
          console.log('Cart syncronized with remote')
        } else {
          data = await fetchCart()
        }
        setCartItems(data.items)
      } catch (e) {
        console.error('Error loading cart:', e)
      }
    }

    if (isAuthenticated) loadCart()
  }, [isAuthenticated])

  async function addItem(item) {
    try {
      const cart = isAuthenticated
        ? await addItemToRemoteCart(item)
        : await addItemToLocalCart(item)

      setCartItems(cart.items)
      sendMessage('Item has been added to cart')
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  async function deleteItem(item) {
    try {
      const data = isAuthenticated
        ? await deleteItemFromRemoteCart(item)
        : await deleteItemFromLocalCart(item)
      console.log(data)
      setCartItems(data.items)
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  async function updateItem(itemId, quantity) {
    try {
      const data = isAuthenticated
        ? await updateItemFromRemoteCart(itemId, quantity)
        : await updateItemFromLocalCart(itemId, quantity)
      setCartItems(data.items)
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  async function increment(itemId, quantity) {
    try {
      const incrementedQuantity = quantity + 1
      const data = isAuthenticated
        ? await updateItemFromRemoteCart(itemId, incrementedQuantity)
        : await updateItemFromLocalCart(itemId, quantity) //Need to update the local function
      console.log(data)
      setCartItems(data.items)
    } catch (error) {
      console.error(error)
    }
  }

  async function decrement(itemId, quantity) {
    try {
      const decreasedQuantity = quantity + -1
      const data = isAuthenticated
        ? await updateItemFromRemoteCart(itemId, decreasedQuantity)
        : await updateItemFromLocalCart({ itemId: item.id, quantity }) // Need to update the local functions
      console.log(data)
      setCartItems(data.items)
    } catch (error) {
      console.error(error)
    }
  }
  const value = {
    cartItems,
    addItem,
    deleteItem,
    updateItem,
    decrement,
    increment,
    total: total.toFixed(2),
    totalItems: cartItems?.length === 0 ? null : cartItems.length,
    isEmpty: cartItems.length === 0,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
