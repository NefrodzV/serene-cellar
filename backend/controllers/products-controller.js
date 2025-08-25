import { param, validationResult } from 'express-validator'
import pool from '../db/pool.js'
import { json } from 'express'
import { validate } from '../middlewares/validationHandler.js'

const getProducts = async (req, res, next) => {
  // Getting all the products from database
  try {
    // TODO: probably need to update images having a white background
    const { rows } = await pool.query(`SELECT
            p.id,
            p.name,
            p.description,
            p.ml,
            p.abv,
            p.category,
            p.slug,
            (   
                SELECT
                jsonb_object_agg(pi.device_type, pi.image_url)
                FROM product_images pi
                WHERE pi.product_id = p.id
            ) as images,
            jsonb_object_agg(CASE 
            WHEN pr.unit = '6-pack' THEN 'sixPack'
            WHEN pr.unit = '12-pack' THEN 'twelvePack'
            WHEN pr.unit = '24-pack' THEN 'twentyFourPack'
            ELSE pr.unit 
        END, jsonb_build_object('unit', pr.unit, 'value',pr.value)) AS price
        FROM products p
        INNER JOIN prices pr ON p.id = pr.product_id
        GROUP BY p.id, p.name
        `)
    return res.json(rows)
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
      const { rowCount, rows } = await pool.query(
        `SELECT
            p.id,
            p.name,
            p.description,
            p.ml,
            p.abv,
            p.category,
            p.slug,
            p.stock,
            (   
                SELECT
                jsonb_object_agg(pi.device_type, pi.image_url)
                FROM product_images pi
                WHERE pi.product_id = p.id
            ) as images,
            jsonb_object_agg(CASE 
            WHEN pr.unit = '6-pack' THEN 'sixPack'
            WHEN pr.unit = '12-pack' THEN 'twelvePack'
            WHEN pr.unit = '24-pack' THEN 'twentyFourPack'
            ELSE pr.unit 
        END, jsonb_build_object('unit', pr.unit, 'value',pr.value)) AS price
        FROM products p
        INNER JOIN prices pr ON p.id = pr.product_id
        WHERE p.slug = $1
        GROUP BY p.id, p.name`,
        [slug]
      )
      if (rowCount === 0) {
        return res
          .status(400)
          .json({ message: 'No product exists with this slug' })
      }
      return res.status(200).json(rows[0])
    } catch (error) {
      next(error)
    }
  },
]

export default {
  getProducts,
  getProduct,
}
