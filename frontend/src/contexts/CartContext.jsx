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
} from '../services/cartService'

export const CartContext = createContext()

export function CartProvider({ children }) {
  const { isAuthenticated } = useUser()

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
        const data = await fetchCart()
        setCartItems(data)
      } catch (e) {
        console.error('Error loading cart:', e)
      }
    }

    if (isAuthenticated) loadCart()
  }, [isAuthenticated])

  async function addItem(item) {
    try {
      const updateCart = isAuthenticated
        ? addItemToRemoteCart(item)
        : addItemToLocalCart(item)
      setCartItems(updateCart)
      sendMessage('Item has been added to cart')
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  function deleteItem(item) {
    try {
      const data = isAuthenticated
        ? deleteItemFromRemoteCart(item)
        : deleteItemFromLocalCart(item)
      setCartItems(data)
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  function updateItem(item) {
    try {
      const data = isAuthenticated
        ? updateItemFromRemoteCart(item)
        : updateItemFromLocalCart(item)
      setCartItems(data)
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }
  const value = {
    cartItems,
    addItem,
    deleteItem,
    updateItem,
    total: total.toFixed(2),
    totalItems: cartItems?.length === 0 ? null : cartItems.length,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
