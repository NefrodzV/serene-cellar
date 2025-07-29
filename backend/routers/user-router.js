import express from 'express'
import { cartController, userController } from '../controllers/index.js'
const router = express.Router()

router.get('/me', userController.getUser)

export default router
