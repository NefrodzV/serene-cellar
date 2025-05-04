import express from 'express'

const router = express.Router()

router.get('/:userId', (req, res) => {
    res.send('GET call to get the user with id')
})

router.get('/:userId/cart', (req, res) => {
    res.send('GET call to the cart items')
})

router.post('/:userId/cart', (req, res) => {
    res.send('POST call to add a item to cart')
})

router.delete('/:userId/cart/:itemId', (req, res) => {
    res.send('DELETE call to delete a item in cart')
})

export default router
