import express from 'express'
import {
  orderController,
  userController,
  authController,
} from '../controllers/index.js'
const router = express.Router()

router.get('/me', userController.getUser)
router.get('/me/orders', orderController.getOrders)
router.post('/me/logout', authController.logout)

export default router
