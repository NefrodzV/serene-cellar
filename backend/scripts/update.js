/**
 * Updates the products with the images url
 */
import { configDotenv } from 'dotenv'
import fs from 'node:fs'
configDotenv()

const domain = process.argv[2]
const filePathToSave = process.argv[3]

if (!domain) {
    console.error('Domain is undefined')
    process.exit(1)
}

if (!filePathToSave) {
    console.error('No file path defined where to save')
    process.exit(1)
}

fs.readFile('./data/products.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    const products = JSON.parse(data)

    products.forEach((product) => {
        // Initializing images object
        product.images = {}
        const formatName = product.name.split(' ').join('_').toLowerCase()
        const imageSizes = ['phone', 'tablet', 'desktop']
        imageSizes.forEach((type) => {
            const url = `${domain}/images/${formatName}_${type}.png`
            product.images[type] = url
        })
    })

    fs.writeFile(filePathToSave, JSON.stringify(products), (err) => {
        if (err) return console.error('Failed to write file:', err)
        console.log('File written successfully')
    })
})
