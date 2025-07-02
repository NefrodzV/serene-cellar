import { body, param, validationResult, matchedData } from 'express-validator'
import { passport } from '../config/index.js'
import pool from '../db/pool.js'
import { validate } from '../middlewares/validationHandler.js'

/**
 * Make the requests return the update cartItems
 */
const getCart = [
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        const user = req.user
        try {
            const { rows } = await pool.query(
                `SELECT 
                ci.id, 
                ci.quantity, 
                ci.unit_price, 
                ci.unit_type,
                ci.product_id,
                json_object_agg(DISTINCT pi.device_type, pi.image_url) as images
                FROM cart c
                INNER JOIN cart_items ci ON c.id = ci.cart_id
                INNER JOIN product_images pi ON ci.product_id = pi.product_id
                WHERE c.user_id = $1
                GROUP BY   
                ci.id, 
                ci.quantity, 
                ci.unit_price, 
                ci.unit_type,
                ci.product_id`,
                [user.id]
            )
            return res.json({
                cart: rows,
            })
        } catch (error) {
            next(error)
        }
    },
]

const addItem = [
    passport.authenticate('jwt', { session: false }),
    param('cartId')
        .exists({ values: 'falsy' })
        .withMessage('Item id must be defined')
        .bail()
        .isInt()
        .withMessage('Item ID must be a valid integer'),
    body('item')
        .exists({ values: 'falsy' })
        .withMessage('No item defined to add to cart'),
    validate,

    async (req, res, next) => {
        const cartId = parseInt(req.params.cartId)
        const data = matchedData(req)
        try {
            await pool.query(
                `INSERT INTO cart_items 
                    (product_id, cart_id, quantity, unit_price, unit_type)
                    VALUES ($1, $2, $3, $4, $5)`,
                [
                    data.productId,
                    cartId,
                    data.quantity,
                    data.unitPrice,
                    data.unitType,
                ]
            )

            // Getting updated cart
            const { rows } = await pool.query(`
                SELECT 
                ci.id, 
                ci.quantity, 
                ci.unit_price, 
                ci.unit_type,
                ci.product_id,
                (
                    SELECT json_object_agg(pi.device_type, pi.image_url)
                    FROM product_images pi
                    WHERE pi.product_id = ci.product_id
                ) as images
                FROM cart_items ci
                `)
            return res.status(201).json({ cart: rows[0] })
        } catch (error) {
            next(error)
        }
    },
]
const deleteItem = [
    passport.authenticate('jwt', { session: false }),
    param('itemId')
        .exists({ values: 'falsy' })
        .withMessage('Item id must be defined')
        .bail()
        .isInt()
        .withMessage('Item ID must be a valid integer'),

    validate,
    async (req, res, next) => {
        const itemId = parseInt(req.params.itemId, 10)
        try {
            const { rowCount } = await pool.query(
                `DELETE FROM cart_items 
                WHERE id=$1`,
                [itemId]
            )

            if (rowCount === 0) {
                return res.status(404).json({ message: 'Cart item not found' })
            }

            const { rows } = await pool.query(`
                SELECT 
                ci.id, 
                ci.quantity, 
                ci.unit_price, 
                ci.unit_type,
                ci.product_id,
                (
                    SELECT json_object_agg(pi.device_type, pi.image_url)
                    FROM product_images pi
                    WHERE pi.product_id = ci.product_id
                ) as images
                FROM cart_items ci
                `)

            return res.status(200).json({ cart: rows[0] })
        } catch (error) {
            next(error)
        }
    },
]

const updateItem = [
    passport.authenticate('jwt', { session: false }),
    param('itemId')
        .exists({ values: 'falsy' })
        .withMessage('Item ID must be defined')
        .bail()
        .isInt()
        .withMessage('Item ID must be a valid integer'),
    body('quantity')
        .exists({ values: 'falsy' })
        .withMessage('Quantity must be defined')
        .bail()
        .isInt()
        .withMessage('Quantity must be a valid integer'),
    body('unitType')
        .exists({ values: 'falsy' })
        .withMessage('Unit type must be defined')
        .bail(),
    validate,
    async function (req, res, next) {
        try {
            const itemId = req.param.itemId
            const { quantity, unitType } = matchedData(req)

            await pool.query(
                `
                    UPDATE cart_items 
                    SET quantity=$1, unit_type=$2 
                    WHERE id=$3`,
                [quantity, unitType, itemId]
            )

            const { rows } = await pool.query(`
                SELECT 
                ci.id, 
                ci.quantity, 
                ci.unit_price, 
                ci.unit_type,
                ci.product_id,
                (
                    SELECT json_object_agg(pi.device_type, pi.image_url)
                    FROM product_images pi
                    WHERE pi.product_id = ci.product_id
                ) as images
                FROM cart_items ci
                `)

            return res.json({ cart: rows[0] })
        } catch (error) {
            next(error)
        }
    },
]
export default {
    getCart,
    addItem,
    deleteItem,
    updateItem,
}
