import { body, matchedData, validationResult } from 'express-validator'
import pool from '../db/pool.js'
import bcrypt from 'bcryptjs'
import { configDotenv } from 'dotenv'
import { validate } from '../middlewares/validationHandler.js'
import { OAuth2Client } from 'google-auth-library'
import { generateToken } from '../services/index.js'
configDotenv()

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const register = [
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
            const { rows } = await pool.query(
                `SELECT *  FROM users WHERE email=$1`,
                [value]
            )
            const user = rows[0]
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
    async (req, res) => {
        try {
            const data = matchedData(req)
            const encryptedPassword = await bcrypt.hash(data.password, 10)
            const { rows } = await pool.query(
                'INSERT INTO users(username, email, password) VALUES ($1,$2,$3) RETURNING id',
                [data.username, data.email, encryptedPassword]
            )

            // TODO:  MAKE THE TOKEN HERE

            const user = rows[0]
            const token = generateToken(user)

            res.cookie('sereneJwt', token, {
                maxAge: 1000 * 60 * 60, // Lasts  1 hour,
                httpOnly: true,
            })

            return res.status(201).json({
                message: 'User registry successful',
            })
        } catch (error) {
            console.error('Register user error: ', error)
            return res.status(500).json({
                message: 'Internal server error, please try again later',
            })
        }
    },
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
        .withMessage('Please provide a valid email address')
        .custom(async (value, { req }) => {
            const { rows } = await pool.query(
                'SELECT *  FROM users WHERE email=$1',
                [value]
            )

            // Check if there is data here
            if (rows.length === 0)
                throw new Error('Incorrect username or password')
            const user = rows.at(0)
            req.user = user
            return true
        }),
    body('password')
        .exists({ values: 'falsy' })
        .withMessage('Password is required')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('Password cannot be empty')
        .bail()
        .custom(async (value, { req }) => {
            console.log(req.user)
            // TODO GET THE PASSWORD FROM DATABASE
            const match = await bcrypt.compare(value, req.user.password)
            if (!match) throw new Error('Incorrect username or password')
            return true
        }),
    validate,
    async (req, res) => {
        const user = req.user
        const token = generateToken(user)

        res.cookie('sereneJwt', token, {
            maxAge: 1000 * 60 * 60, // Lasts  1 hour,
            httpOnly: true,
        })
        return res.json({
            message: 'Login successful',
        })
    },
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

            const { rowCount, rows: existingUserRows } = await pool.query(
                `
                SELECT id FROM users WHERE email=$1`,
                [payload.email]
            )

            if (rowCount > 0) {
                const user = existingUserRows[0]
                const token = generateToken(user)

                res.cookie('sereneJwt', token, {
                    maxAge: 1000 * 60 * 60, // Lasts  1 hour,
                    httpOnly: true,
                })
                return res.json({ message: 'Login successful' })
            }
            const { rows: createdUserRows } = await pool.query(
                `INSERT INTO users(username, email) VALUES ($1, $2) RETURNING id`,
                [payload.name, payload.email]
            )

            const user = createdUserRows[0]
            const token = generateToken(user)

            res.cookie('sereneJwt', token, {
                maxAge: 1000 * 60 * 60, // Lasts  1 hour,
                httpOnly: true,
            })
            return res.json({
                message: 'Login successful',
                user: rows[0],
            })
        } catch (error) {
            next(error)
        }
    },
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
            req.twitterData = data
            console.log('Twitter token', data)
            next()
        } catch (error) {
            console.error('Twitter auth error -> ', error)
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
                console.log('Twitter response error', data)
                return
            }
            console.log('User data:', data)

            /**
             *  TODO: Save the new user into the database
                Example of data returned by the user
                data: {
                    id: '1674953147607920645',
                    name: 'Neftaly Rodriguez',
                    username: 'Nfrodzv23'
                }
             */
        } catch (error) {
            console.error('Twitter get user -> ', error)
        }
    },
]

export default {
    register,
    login,
    google,
    twitter,
}
