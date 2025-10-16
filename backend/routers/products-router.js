import express from 'express'
import { productsController } from '../controllers/index.js'
const router = express.Router()

router.get('/', productsController.getProducts)
router.get('/categories', productsController.getCategories)
router.get('/:id', productsController.getProduct)

export default router
