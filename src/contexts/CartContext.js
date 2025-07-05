import { createContext, useEffect, useState } from 'react'
import { useUser } from '../hooks'
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
    const { isAuthenticated, cartId } = useUser()

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

    useEffect(() => {
        async function loadCart() {
            try {
                const data = await fetchCart(cartId)
                setCartItems(data)
            } catch (e) {
                console.error('Error loading cart:', e)
            }
        }

        if (isAuthenticated) loadCart()
    }, [isAuthenticated, cartId])

    async function addItem(item) {
        try {
            const updateCart = isAuthenticated
                ? addItemToRemoteCart(item, cartId)
                : addItemToLocalCart(item)
            setCartItems(updateCart)
        } catch (error) {
            console.error('Error adding item:', error)
        }
    }

    function deleteItem(item) {
        try {
            const data = isAuthenticated
                ? deleteItemFromRemoteCart(item, cartId)
                : deleteItemFromLocalCart(item)
            setCartItems(data)
        } catch (error) {
            console.error('Error deleting item:', error)
        }
    }

    function updateItem(item) {
        try {
            const data = isAuthenticated
                ? updateItemFromRemoteCart(item, cartId)
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
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
