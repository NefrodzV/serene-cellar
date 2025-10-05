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

        setCart(createCart(data.cart))
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

  async function addItem(quantity, priceId) {
    try {
      const data = isAuthenticated
        ? await addItemToRemoteCart(priceId, Number(quantity))
        : await addItemToLocalCart(priceId, quantity)

      setCart(data?.cart)
      sendMessage('Item has been added to cart')
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  async function deleteItem(itemId) {
    try {
      const data = isAuthenticated
        ? await deleteItemFromRemoteCart(itemId)
        : await deleteItemFromLocalCart(itemId)
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

  async function updateItem(itemId, quantity) {
    console.log(quantity)
    try {
      const data = isAuthenticated
        ? await updateItemFromRemoteCart(itemId, quantity)
        : await updateItemFromLocalCart(itemId, quantity)
      setCart(createCart(data.cart))
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  async function increment(itemId, quantity) {
    try {
      const incrementedQuantity = quantity + 1
      const data = isAuthenticated
        ? await updateItemFromRemoteCart(itemId, incrementedQuantity)
        : await updateItemFromLocalCart(itemId, incrementedQuantity)
      setCart(createCart(data.cart))
    } catch (error) {
      console.error(error)
    }
  }

  async function decrement(itemId, quantity) {
    try {
      const decreasedQuantity = quantity + -1
      const data = isAuthenticated
        ? await updateItemFromRemoteCart(itemId, decreasedQuantity)
        : await updateItemFromLocalCart(itemId, decreasedQuantity) // Need to update the local functions

      setCart(data.cart)
    } catch (error) {
      console.error(error)
    }
  }

  function beginDeleteFlow(itemId) {
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, delete: true } : item
      ),
    }))
  }
  const value = {
    cart,
    setCart,
    addItem,
    deleteItem,
    updateItem,
    decrement,
    increment,

    beginDeleteFlow,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
