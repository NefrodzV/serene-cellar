import { param } from 'express-validator'
import { validate } from '../middlewares/validationHandler.js'
import * as productRepository from '../repositories/product-repository.js'

const getProducts = async (req, res, next) => {
  // Getting all the products from database
  try {
    // TODO: probably need to update images having a white background
    const products = await productRepository.getProducts()
    return res.json(products)
  } catch (err) {
    next(err)
  }
}

const getProduct = [
  param('slug')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Product ID must be defined')
    .bail(),
  validate,
  async (req, res, next) => {
    const slug = req.params.slug
    try {
      const product = await findProduct(slug)
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
    const categories = await getProductCategories()
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
