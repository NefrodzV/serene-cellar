import pool from '../pool.js'

const getProducts = async (req, res) => {
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
        console.error(err)
        return res.status(500).send(err)
    }
}

export default {
    getProducts,
}
