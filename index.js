import express from 'express'
import cors from 'cors'
import { ProductsRouter, UsersRouter } from './routers/index.js'
const app = express()
const port = 3000
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/products', ProductsRouter)
app.use('/users', UsersRouter)
app.get('/', (req, res) => {
    res.send('Hello! Serene Cellar!')
})

app.listen(port, () => {
    console.log('App server started at http://localhost:3000')
})
