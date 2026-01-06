import { param, query, validationResult } from 'express-validator'
import { validate } from '../middlewares/validationHandler.js'
import * as productRepository from '../repositories/product-repository.js'

const getProducts = [
  async (req, res, next) => {
    const { types } = req.query
    if (types) return next()
    try {
      // TODO: probably need to update images having a white background
      const products = await productRepository.getProducts()
      return res.json(products)
    } catch (err) {
      const code = err?.code
      const isSleeping =
        code === 'ETIMEDOUT' || 'ECONNREFUSED' || err?.name === 'AggregateError'

      console.log('Sleeping is running value is:', isSleeping)
      if (isSleeping) return res.sendStatus(503)
      next(err)
    }
  },
  async (req, res, next) => {
    const { types } = req.query
    try {
      const products = await productRepository.getProductsByAlcoholType(types)
      return res.json(products)
    } catch (err) {
      console.error('Error getting products with alcohol type')
      next(err)
    }
  },
]

const getProduct = [
  param('id')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Product id must be defined')
    .isInt()
    .withMessage('id must be an integer')
    .bail(),

  validate,
  async (req, res, next) => {
    const id = req.params.id
    try {
      const product = await productRepository.getProductById(id)
      if (!product) {
        return res
          .status(400)
          .json({ message: 'No product exists with this slug' })
      }
      return res.status(200).json(product)
    } catch (error) {
      next(error)
    }
  },
]

async function getCategories(req, res) {
  try {
    const categories = await productRepository.getProductAlcoholTypes()
    return res.json({ categories })
  } catch (e) {
    console.error(e)
  }
}

export default {
  getProducts,
  getProduct,
  getCategories,
}
