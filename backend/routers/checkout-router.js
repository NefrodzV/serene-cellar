import express from 'express'
import { checkoutController } from '../controllers/index.js'

const router = express.Router()

router.post('/', checkoutController.createSession)

export default router
