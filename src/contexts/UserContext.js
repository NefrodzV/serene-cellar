import { createContext, useState } from 'react'

export const UserContext = createContext()

export function UserProvider({ children }) {
    const [user, setUser] = useState(null)
    const isAuthenticated = !!user
    const cartId = user?.cartId
    const value = { user, setUser, isAuthenticated, cartId }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
