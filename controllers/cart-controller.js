import { body, param, validationResult, matchedData } from 'express-validator'
import { passport } from '../config/index.js'
import pool from '../db/pool.js'
import { validate } from '../middlewares/validationHandler.js'

/**
 * Make the requests return the update cartItems
 */
const getCart = [
    passport.authenticate('jwt', { session: false }),
    param('cartId')
        .exists({ values: 'falsy' })
        .withMessage('Item id must be defined')
        .bail()
        .isInt()
        .withMessage('Item ID must be a valid integer'),
    validate,
    async (req, res, next) => {
        const cartId = req.params.cartId
        try {
            const { rows } = await pool.query(
                `
                SELECT 
                ci.id, 
                ci.quantity, 
                ci.unit_price, 
                ci.unit_type,
                ci.product_id,
                p.slug,
                (
                    SELECT json_object_agg(pi.device_type, pi.image_url)
                    FROM product_images pi
                    WHERE pi.product_id = ci.product_id
                ) as images
                FROM cart_items ci
                INNER JOIN products p ON p.id = ci.product_id
                WHERE ci.cart_id = $1
                `,
                [cartId]
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
        .withMessage('Cart id must be defined')
        .bail()
        .isInt()
        .withMessage('Cart id must be a valid integer'),
    body('item')
        .exists({ values: 'falsy' })
        .withMessage('No item defined to add to cart'),
    validate,

    async (req, res, next) => {
        const cartId = parseInt(req.params.cartId)
        const data = matchedData(req)
        try {
            const existsResult = await pool.query(
                `
                SELECT EXISTS (
                    SELECT * FROM cart_items
                    WHERE product_id=$1 AND unit_type=$2 AND cart_id=$3
                )`,
                [data.productId, data.unitType, cartId]
            )
            if (existsResult.rows[0].exists) {
                await pool.query(
                    `
                    UPDATE cart_items
                    SET quantity = quantity + $1
                    WHERE product_id=$2 AND unit_type=$3 AND cart_id=$4
                    `,
                    [data.quantity, data.productId, data.unitType, cartId]
                )
            } else {
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
            }

            // Getting updated cart
            const { rows } = await pool.query(
                `
                SELECT 
                ci.id, 
                ci.quantity, 
                ci.unit_price, 
                ci.unit_type,
                ci.product_id,
                p.slug,
                (
                    SELECT json_object_agg(pi.device_type, pi.image_url)
                    FROM product_images pi
                    WHERE pi.product_id = ci.product_id
                ) as images
                FROM cart_items ci
                INNER JOIN products p ON p.id = ci.product_id
                WHERE ci.cart_id = $1
                `,
                [cartId]
            )
            return res.status(201).json({ cart: rows })
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
    param('cartId')
        .exists({ values: 'falsy' })
        .withMessage('Cart id must be defined')
        .bail()
        .isInt()
        .withMessage('Cart ID must be a valid integer'),

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

            const cartId = req.params.cartId
            const { rows } = await pool.query(
                `
                SELECT 
                ci.id, 
                ci.quantity, 
                ci.unit_price as price, 
                ci.unit_type as unitType,
                p.slug,
                (
                    SELECT json_object_agg(pi.device_type, pi.image_url)
                    FROM product_images pi
                    WHERE pi.product_id = ci.product_id
                ) as images
                FROM cart_items ci
                INNER JOIN products p ON p.id = ci.product_id
                WHERE ci.cart_id = $1
                `,
                [cartId]
            )

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
    param('cartId')
        .exists({ values: 'falsy' })
        .withMessage('Cart id must be defined')
        .bail()
        .isInt()
        .withMessage('Cart ID must be a valid integer'),
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

            const cartId = req.params.cartId
            const { rows } = await pool.query(
                `
                SELECT 
                ci.id, 
                ci.quantity, 
                ci.unit_price, 
                ci.unit_type,
                ci.product_id,
                p.slug,
                (
                    SELECT json_object_agg(pi.device_type, pi.image_url)
                    FROM product_images pi
                    WHERE pi.product_id = ci.product_id
                ) as images
                FROM cart_items ci
                INNER JOIN products p ON p.id = ci.product_id
                WHERE ci.cart_id = $1
                `,
                [cartId]
            )

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
