import React from 'react'
import { useCart, useProduct, useProductSelection } from '../../hooks'
import { useParams } from 'react-router-dom'
import { Select } from '../ui/Select'
import { Error } from '../ErrorMessage'
import { ErrorsMessages } from '../../constants/ErrorMessages'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
export function ProductDetail() {
  const { slug } = useParams()
  const [product, isLoading] = useProduct(slug)

  const { packSize, quantity, packSizeHandler, quantityHandler, total } =
    useProductSelection(product?.prices)
  const { addItem } = useCart()
  if (!product) return <p>Loading product</p>
  const {
    id,
    name,
    isAvailable,
    prices,
    category,
    abv,
    ml,
    description,
    errors,
    images,
  } = product

  return (
    <Card variant="primary" className="product-detail-card rounded flex">
      <div className="product-detail">
        <div>
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
                      ([key, { unit, value, purchasable }]) => ({
                        key,
                        value: key,
                        text: `${unit} - $${value} ${ErrorsMessages.SELECT[errors[0]] || ''}`,
                        disabled: purchasable === false,
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
                    options={[...(Array(prices[packSize]?.stock) || 0)].map(
                      (_, i) => ({
                        key: i + 1,
                        value: i + 1,
                      })
                    )}
                    onChange={quantityHandler}
                    value={quantity}
                    disabled={prices[packSize]?.purchasable === false}
                  />
                </div>
              </div>
              <p>
                <b className="block">Total:</b>
                {`$${total}`}
              </p>
              <Button
                variant="accent"
                className="fullwidth"
                onClick={() => {
                  addItem(quantity, prices[packSize].id)
                }}
                disabled={prices[packSize]?.errors.length > 0}
              >
                <i className="fa-solid fa-cart-plus"></i>
                Add to cart
              </Button>
            </>
          ) : (
            <Error text={ErrorsMessages[errors[0]]} />
          )}
        </div>
        <img
          className="image"
          srcSet={`${images.gallery[360]} 360w, ${images.gallery[720]} 720w, ${images.gallery[1024]} 1024w`}
          sizes={`(max-width: 600px) 360px, (max-width: 1024px) 720px, 1024px`}
        />
        <h1 className="title">{name}</h1>
      </div>
    </Card>
  )
}
