import express from 'express'
import { cartController } from '../controllers/index.js'

const router = express.Router()

router.get('/:cartId', cartController.getCart)
router.post('/:cartId', cartController.addItem)
router.put('/:cartId/items/:itemId', cartController.updateItem)
router.delete('/:cartId/items/:itemId', cartController.deleteItem)

export default router
