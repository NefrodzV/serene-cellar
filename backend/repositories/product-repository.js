import { db } from '../db/index.js'
import { camelize } from '../utils/camelize.js'

export async function getProducts() {
  const { rows } = await db.pool.query(`
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
              'currency', pr.currency,
              'stock', pv.stock
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

export async function getProductById(id) {
  const { rows } = await db.pool.query(
    `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.active,
      p.type_of_alcohol,
      p.abv,
      EXISTS(
        SELECT 1 
        FROM product_variants pv
        WHERE pv.product_id = p.id AND pv.stock > 0
      ) AS purchasable,
      CASE 
        WHEN EXISTS(
        SELECT 1 
        FROM product_variants pv
        WHERE pv.product_id = p.id AND pv.stock > 0
      ) IS NOT true THEN 'OUT_OF_STOCK' 
        ELSE null 
      END AS error,

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
              'currency', pr.currency,
              'purchasable', 
              CASE WHEN pv.stock > 0 THEN true ELSE false END,
              'error', 
              CASE WHEN pv.stock = 0 THEN 'OUT_OF_STOCK' ELSE null END,
              'stock', pv.stock
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
      FROM products p WHERE p.id = $1
    `,
    [id]
  )

  return camelize(rows[0]) || null
}

export async function getProductAlcoholTypes() {
  const { rows } = await db.pool.query(
    'SELECT DISTINCT type_of_alcohol from products'
  )

  return rows.map((r) => r.type_of_alcohol)
}

export async function getProductsByAlcoholType(types) {
  const filter = types.split(',')
  const { rows } = await db.pool.query(
    `
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
      FROM products p WHERE type_of_alcohol = ANY($1)
    `,
    [filter]
  )

  return camelize(rows)
}
