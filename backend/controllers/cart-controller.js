import { body, param, matchedData } from 'express-validator'
import { passport } from '../config/index.js'
import { validate } from '../middlewares/validationHandler.js'
import {
  createCartItem,
  deleteCartItem,
  getCartByUserId,
  getCartItemByCartProductAndUnit,
  getItemsByUserId,
  incrementCartItemQuantity,
  setCartItemQuantity,
} from '../repositories/cart-repository.js'

/**
 * Make the requests return the update cartItems
 */
const getCart = [
  passport.authenticate('jwt', { session: false }),
  validate,
  async (req, res, next) => {
    try {
      const cart = await getCartByUserId(req.user.id)

      if (!cart) return res.status(404).json({ message: 'Cart not found' })
      return res.json({ cart })
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
    const { item } = matchedData(req)
    try {
      const existingItem = await getCartItemByCartProductAndUnit(
        req.user.id,
        item.productId,
        item.unitType
      )
      let status = null
      let message = null

      if (existingItem) {
        await incrementCartItemQuantity(existingItem.id, item.quantity)
        status = 200
        message = 'Cart item updated'
      } else {
        await createCartItem(
          req.user.id,
          item.productId,
          item.quantity,
          item.price,
          item.unitType
        )
        status = 201
        message = 'Cart item added'
      }

      // Getting updated cart items
      const cart = await getCartByUserId(req.user.id)
      return res.status(status).json({ message, cart })
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
      const cart = await getCartByUserId(req.user.id)

      return res.status(200).json({
        message: 'Cart item deleted',
        cart,
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

      await setCartItemQuantity(itemId, quantity)
      const cart = await getCartByUserId(req.user.id)

      return res.json({
        message: 'Cart item updated',
        cart,
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
    const existingItems = await getItemsByUserId(req.user.id)
    const existingMap = new Map(
      existingItems.map((item) => [
        `${item.product_id}-${item.unit_type}`,
        item,
      ])
    )

    for (const localItem of data.items) {
      const existingItem = existingMap.get(
        `${localItem.productId}-${localItem.unitType}`
      )
      if (existingItem) {
        await incrementCartItemQuantity(existingItem.id, localItem.quantity)
      } else {
        await createCartItem(
          cart.id,
          localItem.productId,
          localItem.quantity,
          localItem.price,
          localItem.unitType
        )
      }
    }

    // Getting updated cart items
    const cart = await getCartByUserId(req.user.id)
    return res.status(200).json({
      message,
      cart,
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
