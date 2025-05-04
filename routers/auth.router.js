import express from 'express'

const router = express.Router()

router.post('/register', async (req, res) => res.send('Register route working'))
router.post('/login', (req, res) => res.send('Login route working'))
router.post('/google', (req, res) => res.send('Google login working'))

export default router
