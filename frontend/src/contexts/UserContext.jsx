import React, { createContext, useEffect, useState } from 'react'
import * as userService from '../services/userService'
import { fetchWithRetries } from '../utils/index'
export const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const isAuthenticated = !!user

  useEffect(() => {
    const controller = new AbortController()
    ;(async () => {
      try {
        const data = await fetchWithRetries(
          () => userService.getCurrentUser(controller.signal),
          {
            signal: controller.signal,
          }
        )
        setUser(data)
      } catch (e) {
        setUser(null)
      }
    })()

    return () => {
      controller.abort()
    }
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
