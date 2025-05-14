import express from 'express'
import { productsController } from '../controllers/index.js'
const router = express.Router()

router.get('/', productsController.getProducts)

export default router
