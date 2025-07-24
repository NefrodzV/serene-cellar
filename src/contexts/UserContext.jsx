import { createContext, useEffect, useState } from 'react'
import React from 'react'
import { login, getCurrentUser } from '../services/userService'

export const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const isAuthenticated = !!user

  useEffect(() => {
    getCurrentUser()
      .then((data) => setUser(data.user))
      .catch((error) => console.error(error))
  }, [])

  async function loginWithEmailAndPassword(email, password) {
    const user = await login(email, password)
    setUser(user)
  }
  const value = {
    user,
    isAuthenticated,
    loginWithEmailAndPassword,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
