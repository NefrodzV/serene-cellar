import express from 'express'
import { cartController } from '../controllers/index.js'

const router = express.Router()

router.get('/', cartController.getCart)
router.post('/', cartController.addItem)
router.delete('/items/:itemId', cartController.deleteItem)

export default router
