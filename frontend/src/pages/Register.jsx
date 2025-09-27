import React from 'react'
import { useState } from 'react'
import { Button } from '../components/elements/Button'
import { Link, useNavigate } from 'react-router-dom'
import { isEmail, isEmpty } from '../../utils'
import { useUser } from '../hooks'
import { Input } from '../components/Input'

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
        console.error('OnChangeHandler input name not handled')
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
        <div className="header">
          <h1>Register</h1>
        </div>
        <div className="body">
          <div>
            <Input
              id={'firstName'}
              label={'First name'}
              onChangeHandler={onChangeHandler}
              type={'text'}
              value={firstName}
              error={errors.firstName}
            />
            <Input
              id={'lastName'}
              label={'Last name'}
              onChangeHandler={onChangeHandler}
              type={'text'}
              value={lastName}
              error={errors.lastName}
            />
          </div>
          <Input
            id={'username'}
            label={'Username'}
            onChangeHandler={onChangeHandler}
            type={'text'}
            value={username}
            error={errors.username}
          />

          <Input
            id={'email'}
            label={'Email'}
            onChangeHandler={onChangeHandler}
            type={'text'}
            value={email}
            error={errors.email}
          />

          <Input
            id={'password'}
            label={'Password'}
            onChangeHandler={onChangeHandler}
            type={'password'}
            value={password}
            error={errors.password}
          />

          <Input
            id={'confirmPassword'}
            label={'Confirm password'}
            onChangeHandler={onChangeHandler}
            type={'text'}
            value={firstName}
            error={errors.confirmPassword}
          />

          {errors.global && <div>{errors.global}</div>}
        </div>
        <div className="footer">
          <Button variant="primary">Register</Button>
          <Link className="center-flex" to={'/login'}>
            Already have an account?
          </Link>
        </div>
      </form>
    </div>
  )
}
