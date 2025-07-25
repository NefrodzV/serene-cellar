import { createContext, useEffect, useState } from 'react'
import React from 'react'
import { login, getCurrentUser, register } from '../services/userService'

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
    const data = await login(email, password)
    setUser(data)
  }

  async function registerWithEmailAndPassword(
    firstName,
    lastName,
    username,
    email,
    password,
    confirmPassword
  ) {
    const data = await register(
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword
    )
    setUser(data)
  }
  const value = {
    user,
    isAuthenticated,
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
