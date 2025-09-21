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
          SELECT json_build_object(
            'thumbnail', json_object_agg(
              (regexp_match(pi.image_url, '([0-9]+)(?=\\.[A-Za-z0-9]+$)'))[1],
              pi.image_url
            ) FILTER (WHERE pi.image_url ILIKE '%thumb%'),
             'gallery', json_object_agg(
              (regexp_match(pi.image_url, '([0-9]+)(?=\\.[A-Za-z0-9]+$)'))[1],
              pi.image_url
            ) FILTER (WHERE pi.image_url NOT ILIKE '%thumb%')

          )
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
              'id', pp.id,
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
          WHEN p.status <> 'active' THEN false
          WHEN NOT EXISTS (
            SELECT 1
            FROM prices pr
            WHERE pr.product_id = p.id
            AND pr.stock_quantity > 0) THEN false
          ELSE true
        END AS purchasable,
        ARRAY_REMOVE(ARRAY[
          CASE WHEN p.status <> 'active' THEN 'PRODUCT_UNAVAILABLE' END,
          CASE WHEN NOT EXISTS (
            SELECT 1
            FROM prices pr
            WHERE pr.product_id = p.id
            AND pr.stock_quantity > 0)THEN 'OUT_OF_STOCK' END
        ], NULL) AS errors
        FROM products p;
        `)

  return camelize(rows)
}

export async function findProduct(slug) {
  const { rowCount, rows } = await db.query(
    `
            SELECT 
              p.id,
              p.name,
              p.description,
              p.slug, 
              p.category,
              ROUND(p.ml)as ml,
              ROUND(p.abv) as abv,
              p.discount_percent,
              (p.discount_percent IS NOT NULL AND p.discount_percent > 0) as has_discount,
              (
                SELECT json_build_object(
                  'thumbnail', json_object_agg(
                    (regexp_match(pi.image_url, '([0-9]+)(?=\\.[A-Za-z0-9]+$)'))[1],
                    pi.image_url
                  ) FILTER (WHERE pi.image_url ILIKE '%thumb%'),
                  'gallery', json_object_agg(
                    (regexp_match(pi.image_url, '([0-9]+)(?=\\.[A-Za-z0-9]+$)'))[1],
                    pi.image_url
                  ) FILTER (WHERE pi.image_url NOT ILIKE '%thumb%')

                )
                FROM product_images pi
                WHERE pi.product_id = p.id
              ) AS images,
              (
                SELECT COALESCE(
                  jsonb_object_agg(
                    pr.format_key,
                    jsonb_build_object(
                      'id', pr.id,
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
