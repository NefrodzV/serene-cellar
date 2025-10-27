import React from 'react'
import { useCart, useProduct, useProductSelection } from '../../hooks'
import { useParams } from 'react-router-dom'
import { Select } from '../ui/Select'
import { Error } from '../ErrorMessage'
import { ErrorsMessages } from '../../constants/ErrorMessages'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { PriceTag, Spinner } from '../ui'
export function ProductDetail() {
  const { id } = useParams()
  const [product, isLoading] = useProduct(id)
  const { variant, quantity, packSizeHandler, quantityHandler, total } =
    useProductSelection(product?.prices)
  const { addItem } = useCart()
  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Card variant="primary" className="product-detail-card rounded flex">
          <div className="product-detail">
            <div>
              <p>{product.description}</p>
              <p>
                <b>Spirit:</b> {product.typeOfAlcohol}
              </p>
              <p>
                <b>Abv:</b> {product.abv}%
              </p>
              {product.purchasable ? (
                <>
                  <div className="selection flex-1rem">
                    <div>
                      <label htmlFor="packSize">
                        <b>Pack Size</b>
                      </label>
                      {/* <Select
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
                      /> */}
                    </div>

                    <div>
                      <label htmlFor="quantity">
                        <b>Quantity</b>
                      </label>
                      <Select
                        value={variant}
                        text={'Select product variant'}
                        onChange={(e) => console.log('Seleciton changed', e)}
                      >
                        {product.variants.map((variant) => (
                          <Select.Option
                            key={variant.priceId}
                            value={variant.priceId}
                            label={`${variant.price} ${variant.package} ${variant.containerKind} ${variant.containerVolumeMl} mL`}
                            disabled={!variant.purchasable}
                          >
                            <span>${variant.price}</span>
                            <span className="pack">{variant.package}</span>
                            <span className="container">
                              {variant.containerKind}
                            </span>
                            <span className="volume">
                              {variant.containerVolumeMl} mL
                            </span>
                          </Select.Option>
                        ))}
                      </Select>

                      {/* <Select
                        options={[...(Array(prices[packSize]?.stock) || 0)].map(
                          (_, i) => ({
                            key: i + 1,
                            value: i + 1,
                          })
                        )}
                        onChange={quantityHandler}
                        value={quantity}
                        disabled={prices[packSize]?.purchasable === false}
                      /> */}
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
                      // addItem(quantity, prices[packSize].id)
                    }}
                    // disabled={prices[packSize]?.errors.length > 0}
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
              srcSet={`${product.images.gallery[360]} 360w, ${product.images.gallery[720]} 720w, ${product.images.gallery[1080]} 1024w`}
              sizes={`(max-width: 600px) 360px, (max-width: 1024px) 720px, 1024px`}
            />
            <h1 className="title">{product.name}</h1>
          </div>
        </Card>
      )}
    </>
  )
}
