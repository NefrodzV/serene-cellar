import express from 'express'
import { userController } from '../controllers/index.js'
const router = express.Router()

router.get('/:userId/cart', (req, res) => {
    res.send('GET call to the cart items')
})

router.post('/:userId/cart', (req, res) => {
    res.send('POST call to add a item to cart')
})

router.delete('/:userId/cart/:itemId', (req, res) => {
    res.send('DELETE call to delete a item in cart')
})

router.get('/me', userController.getUser)

router.get('/:userId', (req, res) => {
    res.send('GET call to get the user with id')
})

export default router
