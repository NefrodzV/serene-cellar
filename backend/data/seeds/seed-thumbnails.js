import pool from '../../db/pool.js'

try {
  const productsRes = await pool.query('SELECT id, name from products')
  for (const product of productsRes.rows) {
    const sizes = ['150', '300', '450']

    for (let i = 0; i < sizes.length; i++) {
      const imageName = `${product.name.split(' ').join('_').toLowerCase()}_thumb_${sizes[i]}.png`
      const domain = 'http://localhost:3000/images/'
      const url = domain + imageName
      await pool.query(
        `INSERT into product_images (product_id, image_url)
        VALUES($1,$2) ON CONFLICT DO NOTHING`,
        [product.id, url]
      )
    }
  }
  console.log('All thumbnails submitted!')
} catch (error) {
  console.error('error seeding thumbnails: ', error)
} finally {
  process.exit(1)
}
