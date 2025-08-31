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
    ) AS prices,
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
        `
        SELECT 
          p.name,
          p.description,
          p.slug, 
          p.category,
          p.abv,
          p.discount_percent,
          (p.discount_percent IS NOT NULL AND p.discount_percent > 0) as has_discount,
          (
            SELECT COALESCE(
              jsonb_object_agg(
                img.device_type,
                img.image_url
              ),
              '{}'::jsonb
            )
            from product_images img WHERE p.id = img.product_id
          ) as images,
          (
            SELECT COALESCE(
              jsonb_object_agg(
                pr.format_key,
                jsonb_build_object(
                  'unit', pr.unit,
                  'value', pr.value,
                  'stock', pr.stock_quantity,
                  'effectiveValue', 
                    CASE 
                      WHEN p.discount_percent IS NOT NULL
                      THEN ROUND(pr.value * (1 - p.discount_percent/100) , 2) 
                    END,
                  'purchasable',
                    CASE
                      WHEN p.status <> 'active' THEN false
                      WHEN pr.stock_quantity  = 0 THEN false
                      ELSE true
                    END,
                  'errors',
                  ARRAY_REMOVE(ARRAY[
                    CASE WHEN pr.stock_quantity <= 0 THEN 'OUT_OF_STOCK' END
                  ], NULL)
                )
              )
            ) FROM prices pr WHERE pr.product_id = p.id
          ) as prices,
          CASE
            WHEN p.status <> 'active' THEN ARRAY['PRODUCT_UNAVAILABLE']
            WHEN NOT EXISTS (
              SELECT 1
              FROM prices pr
              WHERE pr.product_id = p.id
                AND pr.stock_quantity > 0
            )
            THEN ARRAY['OUT_OF_STOCK']
            ELSE ARRAY[]::text[]
          END AS errors,
          CASE
            WHEN p.status <> 'active' THEN false
            WHEN NOT EXISTS (
              SELECT 1
              FROM prices pr
              WHERE pr.product_id = p.id
                AND pr.stock_quantity > 0
            )
            THEN false
            ELSE true
          END AS is_available
          FROM products p WHERE p.slug=$1
          `,
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
