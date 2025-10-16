import db from '../db/index.js'
import { camelize } from '../utils/camelize.js'

export async function getProducts() {
  const { rows } = await db.query(`
    SELECT 
      p.id,
      p.name,
      p.description,
      p.active,
      p.type_of_alcohol,
      p.abv,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'package', pkg.display_name,
              'quantity_per_package', pkg.quantity_per_package,
              'container_kind', c.kind,
              'container_volume_ml', c.ml,
              'price', pr.amount,
              'priceId', pr.id,
              'currency', pr.currency
          ) ORDER BY pkg.quantity_per_package)
           FROM product_variants pv
           INNER JOIN packages pkg ON pkg.id = pv.package_id
           INNER JOIN containers c ON c.id = pv.container_id
           INNER JOIN prices pr ON pr.id = pv.id 
           WHERE pv.product_id = p.id
           
        ), '[]'::json) AS variants,
      COALESCE(
        (
          SELECT jsonb_object_agg(role, role_images) 
          FROM (
            SELECT
            pi.role,
            jsonb_object_agg(
              a.width::text, a.url
            ) AS role_images 
            FROM product_images pi 
            INNER JOIN assets a ON a.id = pi.asset_id
            WHERE p.id = pi.product_id
            GROUP BY role
          ) grouped
        ), '{}'::jsonb) as images
      FROM products p
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

export async function getProductCategories() {
  const { rows } = await db.query('SELECT DISTINCT category from products')
  const categories = rows.map((r) => r.category)
  return categories
}
