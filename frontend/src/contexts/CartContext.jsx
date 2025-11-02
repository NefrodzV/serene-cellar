import { createContext, useEffect, useState } from 'react'
import { useMessages, useUser } from '../hooks'
import * as localCartService from '../services/localCartService'
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
  validateLocalCartItems,
  getLocalCart,
} from '../services/cartService'

export const CartContext = createContext()

export function CartProvider({ children }) {
  const { isAuthenticated } = useUser()
  const { sendMessage } = useMessages()

  const defaultCart = {
    items: [],
    isEmpty: true,
    total: 0,
    subtotal: 0,
    canCheckout: false,
  }
  // Update this to call the functions of the cartService
  const [cart, setCart] = useState(defaultCart)

  useEffect(() => {
    async function loadCart() {
      try {
        let data = null
        if (localCartHasItems()) {
          data = await syncCart()
        } else {
          data = await fetchCart()
        }
        setCart(data.cart)
      } catch (e) {
        console.error('Error loading cart:', e)
      }
    }

    async function getCartSnapshot() {
      try {
        const items = await getLocalCart()
        const data = await validateLocalCartItems(items)

        setCart(data.cart)
      } catch (e) {
        console.error('Error loading cart snapshot:', e)
      }
    }

    if (isAuthenticated) {
      loadCart()
    } else if (localCartHasItems()) {
      getCartSnapshot()
    }
  }, [isAuthenticated])

  async function addItem(item, quantity) {
    try {
      console.log('item', item, quantity)
      const data = isAuthenticated
        ? await addItemToRemoteCart(priceId, Number(quantity))
        : await localCartService.addItem(item, quantity)
      sendMessage('Item has been added to cart')
      setCart(data?.cart)
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  async function deleteItem(item) {
    try {
      const data = isAuthenticated
        ? await deleteItemFromRemoteCart(item.id)
        : await localCartService.deleteItem(item.priceId)
      console.log(data)

      if (data?.cart) {
        setCart({
          ...data.cart,
          items: data.cart.items.map((item) => ({
            ...item,
            delete: false,
          })),
        })
      } else {
        setCart(defaultCart)
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  async function updateItem(item, quantity) {
    console.log(quantity)
    try {
      const data = isAuthenticated
        ? await updateItemFromRemoteCart(item.id, quantity)
        : await localCartService.updateItem(item.priceId, quantity)
      setCart(data.cart)
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  async function increment(item, quantity) {
    try {
      const incrementedQuantity = quantity + 1
      const data = isAuthenticated
        ? await updateItemFromRemoteCart(item.id, incrementedQuantity)
        : await localCartService.updateItem(item.priceId, incrementedQuantity)
      setCart(data.cart)
    } catch (error) {
      console.error(error)
    }
  }

  async function decrement(item, quantity) {
    try {
      const decreasedQuantity = quantity + -1
      const data = isAuthenticated
        ? await updateItemFromRemoteCart(item.id, decreasedQuantity)
        : await localCartService.updateItem(item.priceId, decreasedQuantity) // Need to update the local functions

      setCart(data.cart)
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
