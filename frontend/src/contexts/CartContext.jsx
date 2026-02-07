import { createContext, useEffect, useState } from 'react'
import { useMessages, useUser } from '../hooks'
import * as localCartService from '../services/localCartService'
import * as authCartService from '../services/authCartService'
import React from 'react'
import { fetchWithRetries } from '../utils'

export const CartContext = createContext()

export function CartProvider({ children }) {
  const { isAuthenticated } = useUser()
  const { sendMessage } = useMessages()
  const [isLoading, setIsLoading] = useState(true)
  const defaultCart = {
    items: [],
    isEmpty: true,
    total: 0,
    subtotal: 0,
    canCheckout: false,
  }

  // Update this to call the functions of the cartService
  const [cart, setCart] = useState(defaultCart)
  // Items are busy updating or deleting
  const [busy, setBusy] = useState({})
  useEffect(() => {
    const controller = new AbortController()
    async function loadCart() {
      console.log('Loading cart')
      try {
        let data = await fetchWithRetries(
          () => {
            if (localCartService.hasItems()) {
              return authCartService.syncCart(controller.signal)
            } else {
              return authCartService.fetchCart(controller.signal)
            }
          },
          {
            signal: controller.signal,
          }
        )
        if (!data?.cart) return
        setCart(data?.cart)
      } catch (e) {
        if (e.name === 'AbortError') return
        console.error('Error loading cart:', e)
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    async function getCartSnapshot() {
      try {
        const items = await localCartService.getLocalCart()

        const data = await fetchWithRetries(
          () =>
            localCartService.validateLocalCartItems(items, controller.signal),
          {
            signal: controller.signal,
          }
        )

        setCart(data?.cart)
      } catch (e) {
        if (e.name === 'AbortError') return
        console.error('Error getting localcart snapshot')
        console.error(e)
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      loadCart()
    } else if (localCartService.hasItems()) {
      // Just calculate here the total items for localcart and disable this
      getCartSnapshot()
    } else {
      setIsLoading(false)
      setCart(defaultCart)
    }

    return () => {
      controller.abort()
    }
  }, [isAuthenticated])

  async function addItem(item, quantity) {
    try {
      const data = isAuthenticated
        ? await authCartService.addItem(item.priceId, Number(quantity))
        : await localCartService.addItem(item, quantity)
      sendMessage('Item has been added to cart')
      setCart(data?.cart)
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  async function deleteItem(id) {
    try {
      const data = isAuthenticated
        ? await authCartService.deleteItem(id)
        : await localCartService.deleteItem(id)

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
    try {
      setBusy((prev) => ({ ...prev, [item.id]: true }))
      const data = isAuthenticated
        ? await authCartService.updateItem(item.id, quantity)
        : await localCartService.updateItem(item.id, quantity)
      setCart(data.cart)
    } catch (error) {
      console.error('Error updating item:', error)
    } finally {
      setBusy((prev) => ({ ...prev, [item.id]: false }))
    }
  }

  async function increment(item, quantity) {
    try {
      const incrementedQuantity = quantity + 1
      await updateItem(item, incrementedQuantity)
    } catch (error) {
      console.error(error)
    }
  }

  async function decrement(item, quantity) {
    try {
      const decreasedQuantity = quantity - 1
      await updateItem(item, decreasedQuantity) // Need to update the local functions
    } catch (error) {
      console.error(error)
    }
  }

  function isItemBusy(id) {
    return !!busy[id]
  }
  const value = {
    cart,
    isLoading,
    addItem,
    deleteItem,
    updateItem,
    decrement,
    increment,
    isItemBusy,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
