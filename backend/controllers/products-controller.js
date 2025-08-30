import { param, validationResult } from 'express-validator'
import pool from '../db/pool.js'
import { json } from 'express'
import { validate } from '../middlewares/validationHandler.js'

const getProducts = async (req, res, next) => {
  // Getting all the products from database
  try {
    // TODO: probably need to update images having a white background
    const { rows } = await pool.query(`
    SELECT
    p.id,
    p.name,
    p.description,
    p.ml,
    p.abv,
    p.category,
    p.slug,
    p.discount_percent,
    (p.discount_percent IS NOT NULL AND p.discount_percent > 0) as has_discount,
    (
      SELECT jsonb_object_agg(pi.device_type, pi.image_url)
      FROM product_images pi
      WHERE pi.product_id = p.id
    ) AS images,
    (
      SELECT COALESCE(
        jsonb_object_agg(
          -- key
          CASE
            WHEN pp.unit = '6-pack'  THEN 'SIX_PACK'
            WHEN pp.unit = '12-pack' THEN 'TWELVE_PACK'
            WHEN pp.unit = '24-pack' THEN 'TWENTY_FOUR_PACK'
            ELSE pp.unit
          END,
          -- value
          jsonb_build_object(
            'unit',  pp.unit,
            'value', pp.value,
            'effectiveValue',
              CASE
                WHEN p.discount_percent IS NOT NULL
                THEN ROUND(pp.value * (1 - p.discount_percent/100), 2)
                ELSE pp.value
              END
          )
        ),
        '{}'::jsonb
      )
      FROM prices pp
      WHERE pp.product_id = p.id
    ) AS prices,  -- (rename from "price" since it's a map)
    CASE
      WHEN p.status <> 'active' THEN FALSE
      WHEN p.stock = 0          THEN FALSE
      ELSE TRUE
    END AS purchasable,
    ARRAY_REMOVE(ARRAY[
      CASE WHEN p.status <> 'active' THEN 'PRODUCT_UNAVAILABLE' END,
      CASE WHEN p.stock  = 0         THEN 'OUT_OF_STOCK' END
    ], NULL) AS errors
    FROM products p;
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
            CASE
              WHEN p.discount_percent IS NOT NULL 
              THEN (ROUND(ci.unit_price) * (1 - p.discount_percent/100), 2)
              ELSE unit_price
            END as effective_price,
            (   
                SELECT
                jsonb_object_agg(pi.device_type, pi.image_url)
                FROM product_images pi
                WHERE pi.product_id = p.id
            ) as images,
            jsonb_object_agg(CASE 
            WHEN pr.unit = '6-pack' THEN 'six_pack'
            WHEN pr.unit = '12-pack' THEN 'twelve_pack'
            WHEN pr.unit = '24-pack' THEN 'twenty_four_pack'
            ELSE pr.unit 
        END, jsonb_build_object('unit', pr.unit, 'value',pr.value)) AS price,
        CASE
          WHEN p.active=false THEN false
          WHEN p.stock=0 THEN false
          ELSE true
        END AS purchasable,
        ARRAY_REMOVE(ARRAY[
          CASE WHEN p.active = false THEN 'PRODUCT_UNAVAILABLE' END,
          CASE WHEN p.stock  = 0 THEN 'OUT_OF_STOCK' END],null) as errors
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
