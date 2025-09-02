import React from 'react'
import { useCart, useProduct, useProductSelection } from '../../hooks'
import { useParams, useSearchParams } from 'react-router-dom'
import { Select } from '../Select'
import { Error } from '../Error'
import { ErrorsMessages } from '../../constants/ErrorMessages'

export function ProductView() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const initialQuantity = params.get('quantity')
  const initialPack = params.get('pack')
  const isEditing = params.get('edit') === 'true'
  const itemId = params.get('itemId')

  const [product, isLoading] = useProduct(slug, isEditing)

  const { packSize, quantity, packSizeHandler, quantityHandler, total } =
    useProductSelection(product?.prices, initialPack, initialQuantity)
  const { addItem, updateItem } = useCart()
  if (!product) return <p>Loading product</p>
  const {
    name,
    isAvailable,
    prices,
    category,
    abv,
    ml,
    description,
    errors,
    images,
    stock,
  } = product
  return (
    <div className="product-view">
      <div>
        <h1>{name}</h1>
        <p>{description}</p>
        <p>
          <b>Category:</b> {category}
        </p>
        <p>
          <b>Abv:</b> {abv}%
        </p>
        <p>
          <b>Bottle size:</b> {ml} ml
        </p>
        {isAvailable ? (
          <>
            <div className="flex-1rem">
              <div>
                <label htmlFor="packSize">
                  <b>Pack Size</b>
                </label>
                <Select
                  options={Object.entries(prices).map(
                    ([key, { unit, value }]) => ({
                      key,
                      value: key,
                      text: `${unit} - $${value}`,
                    })
                  )}
                  value={packSize || ''}
                  text={
                    packSize
                      ? `${prices[packSize].unit} - $${prices[packSize].value}`
                      : null
                  }
                  onChange={packSizeHandler}
                />
              </div>

              <div>
                <label htmlFor="quantity">
                  <b>Quantity</b>
                </label>
                <Select
                  options={[...Array(10)].map((_, i) => ({
                    key: i + 1,
                    value: i + 1,
                  }))}
                  onChange={quantityHandler}
                  value={quantity}
                />
              </div>
            </div>
            <p>
              <b className="block">Total:</b>
              {`$${total}`}
            </p>
            <button
              className="button add-cart"
              onClick={() =>
                isEditing
                  ? updateItem({
                      id: itemId,
                      quantity: quantity,
                    })
                  : addItem({
                      productId: product.id,
                      slug: product.slug,
                      name: product.name,
                      quantity,
                      packSize,
                      unitType: product.prices[packSize].unit,
                      price: product.prices[packSize].value,
                      images: product.images,
                    })
              }
            >
              <i className="fa-solid fa-cart-plus"></i>
              Add to cart
            </button>
          </>
        ) : (
          <Error text={ErrorsMessages[errors[0]]} />
        )}
      </div>
      <img
        width={'25%'}
        srcSet={`${images.phone} 360w, ${images.tablet} 720w, ${images.desktop} 1080w`}
        sizes={`(max-width: 600px) 360px, (max-width: 1024px) 720px, 1080px`}
      />
    </div>
  )
}
