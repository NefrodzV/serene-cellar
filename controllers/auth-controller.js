import { body, matchedData } from 'express-validator'
import bcrypt from 'bcryptjs'
import { configDotenv } from 'dotenv'
import { validate } from '../middlewares/validationHandler.js'
import { OAuth2Client } from 'google-auth-library'
import { generateToken } from '../services/index.js'
import { userRepository } from '../repositories/index.js'
import { setCookieAndRespond } from '../utils/setCookieAndRespond.js'
import { json } from 'express'
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
    body('username')
        .exists({ values: 'falsy' })
        .withMessage('Username is required')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('Username cannot be empty'),
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
                username: data.username,
                password: encryptedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
            })
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
    async (req, res) => {
        console.log('This is running')
        const { email, password } = req.body
        try {
            const user = await userRepository.findByEmail(email)
            console.log(user)
            if (!user) {
                return res
                    .status(401)
                    .json({ message: 'Invalid username or password' })
            }
            const match = await bcrypt.compare(user.password, password)
            if (!match) {
                return res
                    .status(401)
                    .json({ message: 'Invalid username or password' })
            }
            const token = generateToken(user)
            req.token = token
            next()
        } catch (error) {
            console.error(error)
            next(error)
        }
    },
    setCookieAndRespond,
]

const google = [
    body('idToken')
        .exists({ values: 'falsy' })
        .bail()
        .isJWT()
        .withMessage('ID token must be a valid jwt'),
    validate,
    async (req, res, next) => {
        console.log()
        const idToken = req.body.idToken
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            })
            const payload = ticket.getPayload()

            let user = await userRepository.findByEmail(payload.email)
            let token = null
            if (!user) {
                console.log('No google user found')
                user = await userRepository.createUserWithGoogle({
                    googleId: payload.sub,
                    email: payload.email,
                    username: payload.name,
                })
            }
            console.log('Google user found')
            token = generateToken(user)
            req.user = user
            req.token = token
            next()
        } catch (error) {
            next(error)
        }
    },
    setCookieAndRespond,
]

const twitter = [
    async (req, res, next) => {
        try {
            const CLIENT_ID = process.env.TWITTER_CLIENT_ID
            const CLIENT_SECRET = process.env.TWITTER_SECRET
            const authHeader = Buffer.from(
                `${CLIENT_ID}:${CLIENT_SECRET}`
            ).toString('base64')
            console.log(req.body.code_verifier)
            const response = await fetch('https://api.x.com/2/oauth2/token', {
                method: 'post',
                headers: {
                    Authorization: `Basic ${authHeader}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: req.body.code,
                    redirect_uri: `https://nefrodzv23.ngrok.io/twitter/callback`,
                    // client_id: process.env.TWITTER_CLIENT_ID,
                    code_verifier: req.body.code_verifier,
                }).toString(),
            })
            const data = await response.json()
            // This may fail
            if (data.errors) {
                console.error('Twitter token fetch error: ', data)
                return next(new Error('Failed to fetch twitter token'))
            }
            req.twitterData = data
            console.log('Twitter token', data)
            next()
        } catch (error) {
            next(error)
        }
    },
    async (req, res, next) => {
        try {
            const options = {
                headers: {
                    Authorization: `Bearer ${req.twitterData.access_token}`,
                },
            }
            const response = await fetch(
                'https://api.twitter.com/2/users/me',
                options
            )
            const data = await response.json()
            if (!response.ok) {
                console.error('Twitter user data fetch error response: ', data)
                return next(
                    new Error('Failed to fetch twitter token user data')
                )
            }

            req.user = data
            next()
        } catch (error) {
            console.error('Twitter get user -> ', error)
            next(error)
        }
    },
    async (req, res, next) => {
        try {
            let user = await userRepository.findByTwitterId(req.user.id)
            let token = null
            /** If no user exists just create a new one */
            if (!user) {
                user = await userRepository.createUserWithTwitter({
                    twitterId: req.user.id,
                    username: req.user.username,
                })
            }
            req.user = user
            req.token = token
            token = generateToken(user)
            /** If user already exists just create the token */
        } catch (error) {
            next(error)
        }
    },
    setCookieAndRespond,
]

export default {
    register,
    login,
    google,
    twitter,
}
