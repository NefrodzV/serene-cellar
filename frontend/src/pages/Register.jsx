import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isEmail, isEmpty } from '../../utils'
import { useUser } from '../hooks'

export function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    global: '', // Form error
  })

  let navigate = useNavigate()
  const { registerWithEmailAndPassword } = useUser()

  async function validateForm(e) {
    e.preventDefault()
    let hasErrors = false
    setErrors({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      global: '',
    })

    if (isEmpty(firstName)) {
      setErrors((prev) => ({
        ...prev,
        firstName: 'Please enter your first name.',
      }))
      hasErrors = true
    }

    if (isEmpty(lastName)) {
      setErrors((prev) => ({
        ...prev,
        lastName: 'Please enter your last name.',
      }))
      hasErrors = true
    }

    if (isEmpty(username)) {
      setErrors((prev) => ({
        ...prev,
        username: 'Please enter your username.',
      }))
      hasErrors = true
    }

    if (isEmpty(email)) {
      setErrors((prev) => ({
        ...prev,
        email: 'Please enter your email.',
      }))
      hasErrors = true
    } else if (!isEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        email: 'Please enter your valid email format.',
      }))
      hasErrors = true
    }

    if (isEmpty(password)) {
      setErrors((prev) => ({
        ...prev,
        password: 'Please enter your password.',
      }))
      hasErrors = true
    } else if (password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: 'Password must have at least 8 characters.',
      }))
      hasErrors = true
    }

    if (isEmpty(confirmPassword)) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: 'Please confirm your password.',
      }))
      hasErrors = true
    } else if (confirmPassword !== password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: 'Passwords do not match.',
      }))
      hasErrors = true
    }

    if (hasErrors) return

    try {
      await registerWithEmailAndPassword(
        firstName,
        lastName,
        username,
        email,
        password,
        confirmPassword
      )
      // For now just navigation maybe update this to show a notification.
      navigate('/shop')
    } catch (error) {
      switch (error.status) {
        case 400:
          const err = {}
          error.fieldErrors.forEach((e) => {
            err[`${e.path}`] = e.msg
          })
          setErrors(err)
          break
        case 401:
          setErrors({ global: error.message })
          break
        default:
          console.error('Unknown error not handled in switch statement')
          console.error(error)
          break
      }
    }
  }

  function onChangeHandler(e) {
    switch (e.target.name) {
      case 'firstName':
        setFirstName(e.target.value)
        break
      case 'lastName':
        setLastName(e.target.value)
        break
      case 'username':
        setUsername(e.target.value)
        break
      case 'email':
        setEmail(e.target.value)
        break
      case 'password':
        setPassword(e.target.value)
        break
      case 'confirmPassword':
        setConfirmPassword(e.target.value)
        break
      default:
        console.error('OnChangeHandler input name not handled')
        break
    }
  }
  return (
    <div>
      <form method="post" noValidate onSubmit={validateForm}>
        <h1>Register</h1>
        <div>
          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              onChange={onChangeHandler}
              type="text"
              name="firstName"
              value={firstName}
              aria-invalid={!!errors.firstName}
              aria-describedby="error-firstName"
            />
            {errors.firstName && (
              <div id="error-firstName">{errors.firstName}</div>
            )}
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              onChange={onChangeHandler}
              type="text"
              name="lastName"
              value={lastName}
              aria-invalid={!!errors.lastName}
              aria-describedby="error-lastName"
            />
            {errors.lastName && (
              <div id="error-lastName">{errors.lastName}</div>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            onChange={onChangeHandler}
            type="text"
            name="username"
            value={username}
            aria-invalid={!!errors.username}
            aria-describedby="error-username"
          />
          {errors.username && <div id="error-username">{errors.username}</div>}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            onChange={onChangeHandler}
            type="email"
            name="email"
            value={email}
            aria-invalid={!!errors.email}
            aria-describedby="error-email"
          />
          {errors.email && <div id="error-email">{errors.email}</div>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            onChange={onChangeHandler}
            type="password"
            name="password"
            value={password}
            aria-invalid={!!errors.password}
            aria-describedby="error-password"
          />
          {errors.password && <div id="error-password">{errors.password}</div>}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            value={confirmPassword}
            onChange={onChangeHandler}
            type="password"
            name="confirmPassword"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby="error-confirmPassword"
          />
          {errors.confirmPassword && (
            <div id="error-confirmPassword">{errors.confirmPassword}</div>
          )}
        </div>
        {errors.global && <div>{errors.global}</div>}
        <button>Register</button>
        <p>
          Already have an account? <Link to={'/login'}>Log in here</Link>
        </p>
      </form>
    </div>
  )
}
