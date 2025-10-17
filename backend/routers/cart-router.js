import express from 'express'
import { cartController } from '../controllers/index.js'

const router = express.Router()

router.get('/me/cart', cartController.getCart)
router.post('/me/cart/items', cartController.addItem)
router.patch('/me/cart/items/:itemId', cartController.updateItem)
router.delete('/me/cart/items/:itemId', cartController.deleteItem)
router.post('/me/cart/sync', cartController.sync)
router.post('/me/cart/validate', cartController.validateLocalCart)

export default router
