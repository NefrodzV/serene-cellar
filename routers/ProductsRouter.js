import express from 'express'
import ProductsController from '../controllers/ProductsController.js'
const router = express.Router()

router.get('/', ProductsController.getProducts)

export default router
