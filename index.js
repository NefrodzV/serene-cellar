import express from 'express'
import cors from 'cors'
import {
    productsRouter,
    userRouter,
    authRouter,
    cartRouter,
} from './routers/index.js'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/errorHandler.js'
const app = express()
const port = 3000
app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/products', productsRouter)
app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/cart', cartRouter)
app.get('/', (req, res) => {
    res.send('Hello! Serene Cellar!')
})
app.use(errorHandler)
app.listen(port, () => {
    console.log('App server started at http://localhost:3000')
})
