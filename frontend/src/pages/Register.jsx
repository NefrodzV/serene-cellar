import React from 'react'
import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Link, useNavigate } from 'react-router-dom'
import { isEmail, isEmpty } from '../../utils'
import { useUser } from '../hooks'
import { TextInput, Heading, PasswordInput } from '../components/ui'

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
    console.log(e)
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
        console.error('OnChangeHandler FormTextInput name not handled')
        break
    }
  }
  return (
    <div className="center-screen bg-color">
      <form
        className="register-form"
        method="post"
        noValidate
        onSubmit={validateForm}
      >
        <Heading>Register</Heading>

        <div className="body">
          <div>
            <TextInput
              id={'firstName'}
              label={'First name'}
              onChange={onChangeHandler}
              value={firstName}
              error={errors.firstName}
            />
            <TextInput
              id={'lastName'}
              label={'Last name'}
              onChange={onChangeHandler}
              value={lastName}
              error={errors.lastName}
            />
          </div>
          <TextInput
            id={'username'}
            label={'Username'}
            onChange={onChangeHandler}
            value={username}
            error={errors.username}
          />

          <TextInput
            id={'email'}
            label={'Email'}
            onChange={onChangeHandler}
            value={email}
            error={errors.email}
          />

          <PasswordInput
            id={'password'}
            label={'Password'}
            onChange={onChangeHandler}
            value={password}
            error={errors.password}
          />

          <PasswordInput
            id={'confirmPassword'}
            label={'Confirm password'}
            onChange={onChangeHandler}
            value={confirmPassword}
            error={errors.confirmPassword}
          />

          {errors.global && <div>{errors.global}</div>}
        </div>

        <Button variant="primary">Register</Button>
        <Link className="center-flex" to={'/login'}>
          Already have an account?
        </Link>
      </form>
    </div>
  )
}
