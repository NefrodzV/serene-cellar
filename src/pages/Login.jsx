import { GoogleLogin } from '@react-oauth/google'
import React, { useState } from 'react'
import { useGoogleAuth, useTwitterAuth, useUser } from '../hooks'
import { Link } from 'react-router-dom'
import { isEmail } from '../../utils'
export function LoginPage() {
  // const { authenticate: twitterAuthenticate } = useTwitterAuth()
  // const { onSuccess, onError } = useGoogleAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '', global: '' })
  const { loginWithEmailAndPassword } = useUser()

  async function validateForm(e) {
    e.preventDefault()
    setErrors({ email: '', password: '', global: '' })
    let hasErrors = false
    if (email.trim().length === 0) {
      setErrors((prev) => ({
        ...prev,
        email: 'Please enter your email.',
      }))
      hasErrors = true
    } else if (!isEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        email: 'Please provide a valid email format.',
      }))

      hasErrors = true
    }

    if (password.length === 0) {
      setErrors((prev) => ({
        ...prev,
        password: 'Please enter your password.',
      }))

      hasErrors = true
    }

    // To avoid calling the api
    if (hasErrors) return
    try {
      setErrors({ email: '', password: '', global: '' })
      await loginWithEmailAndPassword(email, password)
    } catch (error) {
      switch (error.status) {
        case 400:
          setErrors(error.fieldErrors)
          break

        case 401:
          setErrors({ global: error.message })
          break
        default:
          console.error(error)
          break
      }
    }
  }

  function onChangeHandler(e) {
    const event = e.target
    switch (event.name) {
      case 'email':
        setEmail(e.target.value)
        break
      case 'password':
        setPassword(e.target.value)
        break
      default:
        console.error('No event handled with the name')
        break
    }
  }
  return (
    <div>
      <form action="" method="post" onSubmit={validateForm} noValidate>
        <h1>Login</h1>

        <label>
          Email
          <input
            onChange={onChangeHandler}
            name="email"
            type="email"
            id="email"
            value={email}
          />
          <div style={{ minHeight: '1.2rem' }}>{errors.email}</div>
        </label>
        <label>
          Password
          <input
            onChange={onChangeHandler}
            name="password"
            type="password"
            id="password"
            value={password}
          />
          <div style={{ minHeight: '1.2rem' }}>{errors.password}</div>
        </label>
        <div>{errors.global}</div>
        <button>Login</button>
        <Link href="#">Create account</Link>
        <Link href="#">Forgot password?</Link>
      </form>

      {/* <GoogleLogin onSuccess={onSuccess} onError={onError} />
      <button type="button" onClick={twitterAuthenticate}>
        Sign in with X
      </button> */}
    </div>
  )
}
