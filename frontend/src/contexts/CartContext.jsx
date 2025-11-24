import { createContext, useEffect, useState } from 'react'
import { useMessages, useUser } from '../hooks'
import * as localCartService from '../services/localCartService'

import * as authCartService from '../services/authCartService'
import React from 'react'

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
        if (localCartService.hasItems()) {
          data = await authCartService.syncCart()
        } else {
          data = await authCartService.fetchCart()
        }
        setCart(data.cart)
      } catch (e) {
        console.error('Error loading cart:', e)
      }
    }

    async function getCartSnapshot() {
      try {
        const items = await localCartService.getLocalCart()
        const data = await localCartService.validateLocalCartItems(items)

        setCart(data.cart)
      } catch (e) {
        console.error('Error loading cart snapshot:', e)
      }
    }

    if (isAuthenticated) {
      loadCart()
    } else if (localCartService.hasItems()) {
      getCartSnapshot()
    }
  }, [isAuthenticated])

  async function addItem(item, quantity) {
    try {
      console.log('item', item, quantity)
      const data = isAuthenticated
        ? await authCartService.addItem(item.priceId, Number(quantity))
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
        ? await authCartService.deleteItem(item.id)
        : await localCartService.deleteItem(item.priceId)

      if (data?.cart) {
        setCart(data.cart)
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
        ? await authCartService.updateItem(item.id, quantity)
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
        ? await authCartService.updateItem(item.id, incrementedQuantity)
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
        ? await authCartService.updateItem(item.id, decreasedQuantity)
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
