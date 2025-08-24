import express from 'express'
import { cartController } from '../controllers/index.js'

const router = express.Router()

router.get('/me/cart', cartController.getCart)
router.post('/me/cart', cartController.addItem)
router.patch('/me/cart/:itemId', cartController.updateItem)
router.delete('/me/cart/:itemId', cartController.deleteItem)
router.post('/me/cart/sync', cartController.sync)

export default router
