import { body, matchedData } from 'express-validator'
import bcrypt from 'bcryptjs'
import { configDotenv } from 'dotenv'
import { validate } from '../middlewares/validationHandler.js'
import { OAuth2Client } from 'google-auth-library'
import { generateToken } from '../services/index.js'
import { userRepository } from '../repositories/index.js'
import { setCookieAndRespond } from '../utils/setCookieAndRespond.js'
import { json } from 'express'
import * as cartRepository from '../repositories/cart-repository.js'
configDotenv()

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const register = [
  body('firstName')
    .exists({ values: 'falsy' })
    .withMessage('First Name is required')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('First Name cannot be empty'),
  body('lastName')
    .exists({ values: 'falsy' })
    .withMessage('Last Name is required')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Last Name cannot be empty'),

  body('email')
    .exists({ values: 'falsy' })
    .withMessage('Email is required')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Email cannot be empty')
    .bail()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .custom(async (value, { req }) => {
      const user = await userRepository.findByEmail(value)
      if (user) return Promise.reject('This email is already registered')
    }),
  body('password')
    .exists({ values: 'falsy' })
    .withMessage('Password is required')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Password cannot be empty')
    .bail()
    .isLength({
      min: 8,
    })
    .withMessage('Password must be at least 8 characters long'),

  body('confirmPassword')
    .exists({ values: 'falsy' })
    .withMessage('Password confirmation is required')
    .bail()
    .custom((value, { req }) => {
      console.log(value)
      console.log(req.body)
      if (value !== req.body.password) {
        throw new Error('Passwords do not match')
      }

      return true
    }),

  validate,
  async (req, res, next) => {
    try {
      const data = matchedData(req)
      const encryptedPassword = await bcrypt.hash(data.password, 10)
      const user = await userRepository.createUserWithEmail({
        email: data.email,
        password: encryptedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
      })
      // Creating user cart
      await cartRepository.createUserCart(user.id)
      const token = generateToken(user)
      req.user = user
      req.token = token
      next()
    } catch (error) {
      next(error)
    }
  },
  setCookieAndRespond,
]

const login = [
  body('email')
    .exists({ values: 'falsy' })
    .withMessage('Email is required')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Email cannot be empty')
    .bail()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .exists({ values: 'falsy' })
    .withMessage('Password is required')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Password cannot be empty'),
  validate,
  async (req, res, next) => {
    const { email, password } = req.body
    try {
      const user = await userRepository.findByEmail(email)
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' })
      }
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        return res.status(401).json({ message: 'Invalid username or password' })
      }
      const token = generateToken(user)
      req.token = token
      req.user = user
      next()
    } catch (error) {
      console.error(error)
      next(error)
    }
  },
  setCookieAndRespond,
]

const logout = (req, res) => {
  res.clearCookie('serene')
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    Pragma: 'no-cache',
    Expires: '0',
  })
  return res.sendStatus(204)
}

export default {
  register,
  login,
  logout,
}
