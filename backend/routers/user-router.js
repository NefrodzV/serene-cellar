import express from 'express'
import { orderController, userController } from '../controllers/index.js'
const router = express.Router()

router.get('/me', userController.getUser)
router.get('/me/orders', orderController.getOrders)

export default router
