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
  const { sendMessage } = useMessages()

  // Update this to call the functions of the cartService
  const [cart, setCart] = useState({
    items: [],
    isEmpty: true,
    total: 0,
    subtotal: 0,
    canCheckout: false,
  })

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
        console.log(data)
        setCart(data.cart)
      } catch (e) {
        console.error('Error loading cart:', e)
      }
    }

    if (isAuthenticated) loadCart()
  }, [isAuthenticated])

  async function addItem(item) {
    try {
      const data = isAuthenticated
        ? await addItemToRemoteCart(item)
        : await addItemToLocalCart(item)

      setCart(data?.cart)
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
      setCart(data.cart)
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  async function updateItem(item, quantity) {
    try {
      const itemId = item.id
      const data = isAuthenticated
        ? await updateItemFromRemoteCart(itemId, quantity)
        : await updateItemFromLocalCart(itemId, quantity)
      setCart(data.cart)
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  async function increment(item, quantity) {
    try {
      const itemId = item.id
      const incrementedQuantity = quantity + 1
      const data = isAuthenticated
        ? await updateItemFromRemoteCart(itemId, incrementedQuantity)
        : await updateItemFromLocalCart(itemId, quantity) //Need to update the local function
      console.log(data)
      setCart(data.cart)
    } catch (error) {
      console.error(error)
    }
  }

  async function decrement(item, quantity) {
    try {
      const itemId = item.id
      const decreasedQuantity = quantity + -1
      const data = isAuthenticated
        ? await updateItemFromRemoteCart(itemId, decreasedQuantity)
        : await updateItemFromLocalCart({ itemId: item.id, quantity }) // Need to update the local functions

      setCart(data?.cart)
    } catch (error) {
      console.error(error)
    }
  }
  const value = {
    cart,
    addItem,
    deleteItem,
    updateItem,
    decrement,
    increment,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
