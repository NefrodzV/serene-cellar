import express from 'express'
import { cartController } from '../controllers/index.js'

const router = express.Router()

router.get('/', cartController.getCart)
router.post('/:cartId', cartController.addItem)
router.delete('/:cardId/items/:itemId', cartController.deleteItem)

export default router
