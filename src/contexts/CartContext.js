import { createContext, useContext, useEffect, useState } from 'react'
import { API_URL } from '../config'
import { useUser } from '../hooks'

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
        async function getCart() {
            try {
                const res = await fetch(`${API_URL}/cart/${cartId}`)
                const data = await res.json()

                if (!res.ok) {
                    return console.error('Get cart error res:', data)
                }
                setCartItems(data)
            } catch (error) {
                console.error('Get auth user cart error:', error)
            }
        }

        if (isAuthenticated) getCart()
    }, [isAuthenticated])

    async function addToCart(item) {
        if (isAuthenticated) {
            postToCart(item)
        } else {
            addToLocalCart(item)
        }
    }

    function addToLocalCart(item) {
        const localCart = JSON.parse(localStorage.getItem('cart')) || []
        const existing = localCart.find(
            (i) =>
                i.productId === item.productId && i.unitType === item.unitType
        )
        if (existing) {
            existing.quantity = item.quantity
        } else {
            localCart.push(item)
        }
        localStorage.setItem('cart', JSON.stringify(localCart))
        setCartItems([...cartItems, ...localCart])
    }

    async function postToCart(item) {
        try {
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
                return console.error('Add cart item error:', data)
            }

            setCartItems([...cartItems, data])
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * Todo:  Need to make the logic to remove local cart and
     * send the items to the backend
     */

    const value = {
        cartItems,
        addToCart,
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
