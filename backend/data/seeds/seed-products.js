import db from '../../db/pool.js'
import { argv } from 'node:process'
import { readFile } from 'node:fs/promises'
import pool from '../../db/pool.js'
import { imageSizeFromFile } from 'image-size/fromFile'

const client = await pool.connect()
const variantMap = {
  bottle: {
    kind: 'single',
    qty: 1,
    displayName: '1-unit',
  },
  single: {
    kind: 'single',
    qty: 1,
    displayName: '1-unit',
  },
  six_pack: {
    kind: 'pack',
    qty: 6,
    displayName: '6-pack',
  },

  twelve_pack: {
    kind: 'pack',
    qty: 12,
    displayName: '12-pack',
  },

  twenty_four_pack: {
    kind: 'pack',
    qty: 24,
    displayName: '24-pack',
  },

  case: {
    kind: 'case',
    qty: 6,
    displayName: 'case',
  },
}
try {
  const backendUrl = 'http://localhost:3000/'
  const dir = 'images/products'
  const data = await readFile('data/products-localhost.json', 'utf-8')
  const products = JSON.parse(data)

  await client.query('BEGIN')
  for (const product of products) {
    const createProductRes = await client.query(
      `
        INSERT INTO products (name, description, type_of_alcohol, abv)
         VALUES ($1, $2, $3, $4)ON CONFLICT DO NOTHING RETURNING id`,
      [
        product.name,
        product.description,
        product.category.toLowerCase(),
        product.abv,
      ]
    )

    const productId = createProductRes.rows[0].id
    console.log('productId', productId)

    const createContainerRes = await client.query(
      `INSERT INTO containers (kind, ml) VALUES ($1, $2) ON CONFLICT (kind,ml) DO UPDATE SET ml=EXCLUDED.ml RETURNING id`,
      ['bottle', product.ml]
    )

    const containerId = createContainerRes.rows[0].id

    for (const [key, value] of Object.entries(product.pricing)) {
      const createPackageRes = await client.query(
        `
          INSERT INTO packages (package_kind, quantity_per_package, display_name)
          VALUES ($1, $2, $3) ON CONFLICT (package_kind, quantity_per_package) DO  UPDATE SET package_kind=EXCLUDED.package_kind RETURNING id
                `,
        [variantMap[key].kind, variantMap[key].qty, variantMap[key].displayName]
      )
      const packageId = createPackageRes.rows[0].id
      const createProductVariantRes = await client.query(
        `INSERT INTO product_variants (product_id, container_id, package_id, stock) VALUES ($1, $2, $3,$4) RETURNING id`,
        [productId, containerId, packageId, Math.floor(Math.random() * 1000)]
      )
      const variantId = createProductVariantRes.rows[0].id
      await client.query(
        'INSERT INTO prices (variant_id, amount) VALUES ($1, $2)',
        [variantId, value]
      )
    }

    for (const [key, value] of Object.entries(product.images)) {
      for (const [imgKey, img] of Object.entries(value)) {
        const imgRelativePath = `${dir}/${img}`
        const url = backendUrl + imgRelativePath
        const { height, width, type } = await imageSizeFromFile(imgRelativePath)
        const createAssetRes = await client.query(
          'INSERT INTO assets (storage_key, url, width, height, mime_type) VALUES($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING RETURNING id',
          [imgRelativePath, url, width, height, type]
        )

        const assetId = createAssetRes.rows[0].id
        await client.query(
          `INSERT INTO product_images (product_id, role, asset_id) VALUES ($1, $2, $3)`,
          [productId, key, assetId]
        )
      }
    }
  }
  await client.query('COMMIT')
  console.log('Products seeding correctly!')
} catch (e) {
  await client.query('ROLLBACK')
  console.error('Something went wrong seeding products', e)
} finally {
  client.release()
  process.exit()
}
