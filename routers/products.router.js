import express from 'express'
import ProductsController from '../controllers/products.controller.js'
const router = express.Router()

router.get('/', ProductsController.getProducts)

export default router
