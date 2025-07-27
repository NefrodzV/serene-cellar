import express from 'express'
import { cartController, userController } from '../controllers/index.js'
const router = express.Router()

router.get('/', userController.getUser)

router.get('/cart', cartController.getCart)
router.post('/cart', cartController.addItem)
router.put('/cart/:itemId', cartController.updateItem)
router.delete('/cart/:itemId', cartController.deleteItem)

export default router
