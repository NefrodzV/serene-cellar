import express from 'express'
import { ProductsController } from '../controllers/index.js'
const router = express.Router()

router.get('/', ProductsController.getProducts)

export default router
