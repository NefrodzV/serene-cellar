import db from '../db/index.js'
import { camelize } from '../utils/camelize.js'

export async function findProducts() {
  const { rows } = await db.query(`
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
              pp.format_key,
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

  return camelize(rows)
}

export async function findProduct(slug) {
  const { rowCount, rows } = await db.query(
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

  return camelize(rows[0]) || null
}
