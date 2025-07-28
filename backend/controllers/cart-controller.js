import { body, param, validationResult, matchedData } from 'express-validator'
import { passport } from '../config/index.js'
import pool from '../db/pool.js'
import { validate } from '../middlewares/validationHandler.js'
import {
    createCartItem,
    deleteCartItem,
    getCardByUserId,
    getCartItemByCartProductAndUnit,
    getCartItemsWithProductData,
    getItemsByCartId,
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
            return res.json({ cart: { items } })
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
                .json({ message, cart: { items: cartItems } })
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
        .withMessage('Item id must be a valid integer'),
    validate,
    async (req, res, next) => {
        const data = matchedData(req)
        try {
            await deleteCartItem(data.itemId)
            const cart = await getCardByUserId(req.user.id)
            const cartItems = await getCartItemsWithProductData(cart.id)

            return res.status(200).json({
                message: 'Cart item deleted',
                cart: { items: cartItems },
            })
        } catch (error) {
            next(error)
        }
    },
]

const updateItem = [
    passport.authenticate('jwt', { session: false }),
    param('itemId')
        .exists({ values: 'falsy' })
        .withMessage('Item id must be defined')
        .bail()
        .isInt()
        .withMessage('Item id must be a valid integer'),
    body('quantity')
        .exists({ values: 'falsy' })
        .withMessage('Quantity must be defined')
        .bail()
        .isInt()
        .withMessage('Quantity must be a valid integer'),
    validate,
    async function (req, res, next) {
        try {
            const { quantity, itemId } = matchedData(req)
            await updateCartItemQuantity(itemId, quantity)
            const cart = await getCardByUserId(req.user.id)
            const cartItems = await getCartItemsWithProductData(cart.id)
            return res.json({
                message: 'Cart item updated',
                cart: {
                    items: cartItems,
                },
            })
        } catch (error) {
            next(error)
        }
    },
]

// This will sync the local cart items with the remote one
const sync = [
    passport.authenticate('jwt', { session: false }),
    body('items')
        .exists({ values: 'falsy' })
        .withMessage('Items must be defined')
        .bail()
        .isArray()
        .withMessage('Items must be an array')
        .bail(),
    validate,
    async function (req, res, next) {
        const data = matchedData(req)
        const cart = await getCardByUserId(req.user.id)

        // Maybe do a get function without products data it isnt needed right here
        const existingItems = await getItemsByCartId(cart.id)
        const existingMap = new Map(
            existingItems.map((item) => [
                `${item.product_id}-${item.unit_type}`,
                item,
            ])
        )

        for (const localItem of data.items) {
            const existingItem = existingMap.get(
                `${localItem.product_id}-${localItem.unit_type}`
            )
            if (existingItem) {
                await updateCartItemQuantity(
                    existingItem.id,
                    localItem.quantity
                )
            } else {
                await createCartItem(
                    cart.id,
                    localItem.productId,
                    localItem.quantity,
                    localItem.unitPrice,
                    localItem.unitType
                )
            }
        }

        // Getting updated cart items
        const cartItems = await getCartItemsWithProductData(cart.id)

        return res.status(200).json({
            message: 'Remote cart item syncronized',
            cart: { items: cartItems },
        })
    },
]
export default {
    getCart,
    addItem,
    deleteItem,
    updateItem,
    sync,
}
