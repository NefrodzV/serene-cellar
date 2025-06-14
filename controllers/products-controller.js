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
            p.volume_ml,
            p.abv,
            jsonb_object_agg(DISTINCT pi.device_type, pi.image_url) AS images,
            jsonb_object_agg(CASE 
            WHEN pr.unit = '6/pkg' THEN 'sixPack'
            WHEN pr.unit = '12/pkg' THEN 'twelvePack'
            WHEN pr.unit = '24/pkg' THEN 'twentyFourPack'
            ELSE pr.unit 
        END, jsonb_build_object('unit', pr.unit, 'value',pr.value)) AS price
        FROM products p
        INNER JOIN product_images pi ON p.id = pi.product_id
        INNER JOIN prices pr ON p.id = pr.product_id
        GROUP BY p.id, p.name
        `)
        return res.json(rows)
    } catch (err) {
        next(err)
    }
}

const getProduct = [
    param('productId')
        .trim()
        .exists({ values: 'falsy' })
        .withMessage('Product ID must be defined')
        .bail()
        .isInt()
        .withMessage('Product ID must be a valid integer'),
    validate,
    async (req, res, next) => {
        const productId = parseInt(req.params.productId, 10)
        try {
            const { rowCount, rows } = await pool.query(
                `SELECT
            p.id,
            p.name,
            p.description,
            p.volume_ml,
            p.abv,
            jsonb_object_agg(DISTINCT pi.device_type, pi.image_url) AS images,
            jsonb_object_agg(CASE 
            WHEN pr.unit = '6/pkg' THEN 'sixPack'
            WHEN pr.unit = '12/pkg' THEN 'twelvePack'
            WHEN pr.unit = '24/pkg' THEN 'twentyFourPack'
            ELSE pr.unit 
        END, jsonb_build_object('unit', pr.unit, 'value',pr.value)) AS price
        FROM products p
        INNER JOIN product_images pi ON p.id = pi.product_id
        INNER JOIN prices pr ON p.id = pr.product_id
        WHERE p.id = $1
        GROUP BY p.id, p.name`,
                [productId]
            )
            if (rowCount === 0) {
                return res
                    .status(400)
                    .json({ message: 'No product exists with this ID' })
            }
            return res.status(200).json({ product: rows[0] })
        } catch (error) {
            next(error)
        }
    },
]

export default {
    getProducts,
    getProduct,
}
