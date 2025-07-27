import { body, param, validationResult, matchedData } from 'express-validator'
import { passport } from '../config/index.js'
import pool from '../db/pool.js'
import { validate } from '../middlewares/validationHandler.js'
import {
    createCartItem,
    getCardByUserId,
    getCartItemByCartProductAndUnit,
    getCartItemsWithProductData,
    updateCartItemQuantity,
} from '../repositories/cart-repository.js'

/**
 * Make the requests return the update cartItems
 */
const getCart = [
    passport.authenticate('jwt', { session: false }),
    validate,
    async (req, res, next) => {
        try {
            const cart = await getCardByUserId(req.user.id)
            if (!cart)
                return res.status(404).json({ message: 'Cart not found' })
            const items = await getCartItemsWithProductData(cart.id)
            return res.json({ cart: { ...cart, items } })
        } catch (error) {
            next(error)
        }
    },
]
/**TODO: Update the other function to remove the id param
 * and add functions to the repository*/
const addItem = [
    passport.authenticate('jwt', { session: false }),
    body('item')
        .exists({ values: 'falsy' })
        .withMessage('No item defined to add to cart'),
    validate,

    async (req, res, next) => {
        const data = matchedData(req)
        try {
            const cart = await getCardByUserId(req.user.id)
            const existingItem = await getCartItemByCartProductAndUnit(
                cart.id,
                data.productId,
                data.unitType
            )
            let status = null
            let message = null

            if (existingItem) {
                await updateCartItemQuantity(existingItem.id, data.quantity)
                status = 200
                message = 'Cart item updated'
            } else {
                await createCartItem(
                    cart.id,
                    data.productId,
                    data.quantity,
                    data.unitPrice,
                    data.unitType
                )
                status = 201
                message = 'Cart item added'
            }

            // Getting updated cart items
            const cartItems = await getCartItemsWithProductData(cart.id)
            return res
                .status(status)
                .json({ message, cart: { ...cart, items: cartItems } })
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
