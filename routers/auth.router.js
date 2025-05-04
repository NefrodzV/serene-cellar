import express from 'express'
import { AuthController } from '../controllers/index.js'
const router = express.Router()

router.post('/register', AuthController.register)
router.post('/login', (req, res) => res.send('Login route working'))
router.post('/google', (req, res) => res.send('Google login working'))

export default router
