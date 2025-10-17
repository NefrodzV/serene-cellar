import { body, param, matchedData } from 'express-validator'
import { passport } from '../config/index.js'
import { validate } from '../middlewares/validationHandler.js'
import * as cartRepository from '../repositories/cart-repository.js'

/**W
 * Make the requests return the update cartItems
 */
const getCart = [
  passport.authenticate('jwt', { session: false }),
  validate,
  async (req, res, next) => {
    try {
      const cart = await cartRepository.getCartByUserId(req.user.id)
      console.log(cart)
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
  body('priceId').exists({ values: 'falsy' }).withMessage('No priceId defined'),
  body('quantity')
    .exists({ values: 'falsy' })
    .withMessage('No quantity defined'),
  validate,

  async (req, res, next) => {
    const { productId, priceId, quantity } = matchedData(req)

    try {
      await cartRepository.createCartItem(req.user.id, quantity, priceId)
      const cart = await cartRepository.getCartByUserId(req.user.id)
      return res.json({ cart })
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
      await cartRepository.deleteCartItem(data.itemId)
      const cart = await cartRepository.getCartByUserId(req.user.id)

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

      await cartRepository.setCartItemQuantity(itemId, quantity)
      const cart = await cartRepository.getCartByUserId(req.user.id)

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
    const existingItems = await cartRepository.getItemsByUserId(req.user.id)
    const existingMap = new Map(
      existingItems.map((item) => [`${item.priceId}`, item])
    )

    for (const localItem of data.items) {
      const existingItem = existingMap.get(`${localItem.priceId}`)
      if (existingItem) {
        await cartRepository.incrementCartItemQuantity(
          existingItem.id,
          localItem.quantity
        )
      } else {
        await cartRepository.createCartItem(
          req.user.id,
          localItem.quantity,
          localItem.priceId
        )
      }
    }

    // Getting updated cart items
    const cart = await cartRepository.getCartByUserId(req.user.id)
    return res.status(200).json({
      cart,
    })
  },
]

const validateLocalCart = [
  body('items')
    .exists({ values: 'falsy' })
    .withMessage('Items must be defined')
    .bail()
    .isArray()
    .withMessage('Items must be an array')
    .bail(),
  validate,
  async (req, res, next) => {
    const { items } = matchedData(req)

    if (items.length === 0) {
      return res.status(422).json({ error: 'There are no items in array' })
    }
    try {
      const cart = await cartRepository.validateLocalCartItems(items)

      if (!cart) {
        return res
          .status(422)
          .json({ error: 'Server could not process local cart' })
      } else {
        return res.json({ cart })
      }
    } catch (e) {
      next(e)
    }
  },
]
export default {
  getCart,
  addItem,
  deleteItem,
  updateItem,
  sync,
  validateLocalCart,
}
