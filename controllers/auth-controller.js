import { body, matchedData, validationResult } from 'express-validator'
import pool from '../pool.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv'
configDotenv()
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
                `SELECT FROM users WHERE email=$1`,
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
            if (value !== req.body.password) {
                throw new Error('Passwords do not match')
            }
        }),

    (req, res, next) => {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({
                message: 'Errors in request',
                errors: result.array(),
            })
        }
        next()
    },
    async (req, res) => {
        try {
            const data = matchedData(req)
            const encryptedPassword = bcrypt.hash(data.password, 10)
            const { rows } = await pool.query(
                'INSERT INTO users(username, email, password) VALUES ($1,$2,$3) RETURNING id',
                [data.username, data.email, encryptedPassword]
            )

            // TODO:  MAKE THE TOKEN HERE

            const user = rows[0]
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            )
        } catch (error) {
            console.error('Database query failed:  ', error)
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
        .withMessage('Please provide a valid email address'),
    body('password')
        .exists({ values: 'falsy' })
        .withMessage('Password is required')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('Password cannot be empty')
        .bail(),
    // TODO: validate password here
    (req, res) => {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({
                message: 'Errors in request',
                errors: result.array(),
            })
        }

        // TODO: DO THE LOGIC TO LOGIN HERE

        return res.json({ message: 'Everything ok' })
    },
]

export default {
    register,
    login,
}
