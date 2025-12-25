import { createContext, useEffect, useState } from 'react'
import React from 'react'
import * as userService from '../services/userService'

export const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const isAuthenticated = !!user

  useEffect(() => {
    userService
      .getCurrentUser()
      .then((data) => setUser(data))
      .catch((error) => console.error(error))
  }, [])

  async function loginWithEmailAndPassword(email, password) {
    const data = await userService.login(email, password)
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
    const data = await userService.register(
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword
    )
    setUser(data)
  }

  async function logout() {
    try {
      await userService.logout()
      setUser(null)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const value = {
    user,
    isAuthenticated,
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    logout,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
