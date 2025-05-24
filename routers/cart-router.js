import express from 'express'
import { cartController } from '../controllers/index.js'

const router = express.Router()

router.get('/', cartController.getCart)
// TODO: Make endpoint for update, delete and add
export default router
