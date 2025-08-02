import { GoogleLogin } from '@react-oauth/google'
import React, { useState } from 'react'
import { useGoogleAuth, useTwitterAuth, useUser } from '../hooks'
import { Link, useNavigate } from 'react-router-dom'
import { isEmail } from '../../utils'
export function LoginPage() {
  // const { authenticate: twitterAuthenticate } = useTwitterAuth()
  // const { onSuccess, onError } = useGoogleAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '', global: '' })
  const { loginWithEmailAndPassword } = useUser()
  let navigate = useNavigate()
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

      // Navigate to shop page but needs to be updated if the user logs in because he wants to checkout his items
      navigate('/shop')
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
    <div className="center-screen">
      <form
        className="login-form"
        method="post"
        onSubmit={validateForm}
        noValidate
      >
        <h1>Login</h1>

        <div className="input container">
          <label htmlFor="email">Email</label>
          <input
            className="input primary"
            onChange={onChangeHandler}
            name="email"
            type="email"
            id="email"
            value={email}
            aria-invalid={!!errors.email}
            aria-describedby="error-email"
          />
          {errors.email && <div id={'error-email'}>{errors.email}</div>}
        </div>
        <div className="input container">
          <label htmlFor="password">Password</label>
          <input
            className="input primary"
            id={'password'}
            onChange={onChangeHandler}
            name="password"
            type="password"
            value={password}
            aria-invalid={!!errors.password}
            aria-describedby="error-password"
          />
          {errors.password && (
            <div className="error-message" id={'error-password'}>
              {errors.password}
            </div>
          )}
        </div>
        <div>{errors.global}</div>
        <button className="button primary">Login</button>

        <Link className="push-right" href="#">
          Forgot password?
        </Link>
        <p className="center-flex">
          Don't have an account? <Link to={'/register'}>Register here.</Link>
        </p>
      </form>
    </div>
  )
}
