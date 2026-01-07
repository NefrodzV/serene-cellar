import React, { useState } from 'react'
import { useUser } from '../hooks'
import { Link, useNavigate } from 'react-router-dom'
import { isEmail } from '../utils'
import { Button } from '../components/ui/Button'
import { Heading } from '../components/ui/Heading'
import { Form, PasswordInput, TextInput } from '../components/ui'
export function LoginPage() {
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
    <div className="login">
      <Form
        className="login-form"
        method="post"
        onSubmit={validateForm}
        noValidate
      >
        <Heading>Login</Heading>

        <TextInput
          id={'email'}
          value={email}
          label={'Email'}
          onChange={onChangeHandler}
          error={errors.email}
        />
        <PasswordInput
          id={'password'}
          label={'Password'}
          value={password}
          onChange={onChangeHandler}
          error={errors.password}
        />
        <div>{errors.global}</div>
        <Button variant="primary">Login</Button>
        <Link className="push-right" href="#">
          Forgot password?
        </Link>
        <p className="center-flex">
          Don't have an account? <Link to={'/register'}>Register here.</Link>
        </p>
      </Form>
    </div>
  )
}
