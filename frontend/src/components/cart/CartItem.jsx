import React, { useEffect, useRef, useState } from 'react'
import { useCart } from '../../hooks'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { API_URL } from '../../config'
import { Metadata, QuantityStepper, Title } from '../ui'

export function CartItem({
    item,
    isItemBusy,
    onDelete,
    deleteItem,
    increment,
    decrement,
}) {
    const MIN_ITEM_QUANTITY = 1
    const {
        id,
        priceId,
        name,
        images,
        quantity,
        price,
        package: unit,
        stock,
        ml,
        hasDiscount,
        lineTotal,
        container,
        purchasable,
    } = item

    console.log(item)
    const isBusy = isItemBusy(id)

    return (
        <Card
            className={`${item?.status}`}
            as="li"
            onTransitionEnd={(e) => {
                if (e.target !== e.currentTarget) return
                if (e.propertyName !== 'opacity') return
                if (item.status === 'exit') {
                    deleteItem(item.id)
                }
            }}
        >
            <article className="cart-item">
                <div className="cart-item-image image-wrapper image-wrapper--cart-item">
                    <img
                        className="thumbnail"
                        alt={name}
                        srcSet={`${API_URL + '/' + images?.thumbnail[150]} 1x, ${API_URL + '/' + images?.thumbnail[300]} 2x, ${API_URL + '/' + images?.thumbnail[450]} 3x`}
                    />
                </div>

                <div className="cart-item-content">
                    <Title element="p" variant={'cart-item'}>
                        {name}
                    </Title>
                    {purchasable ? (
                        <span className="stock-status stock-status--text-green">
                            In stock
                        </span>
                    ) : (
                        <span className="stock-status stock-status--text-red">
                            Out of stock
                        </span>
                    )}
                    <div>${price} each</div>
                </div>
                <QuantityStepper
                    quantity={quantity}
                    min={MIN_ITEM_QUANTITY}
                    max={stock}
                    onIncrement={() => {
                        increment(item, Number(quantity))
                    }}
                    onDecrement={() => {
                        decrement(item, Number(quantity))
                    }}
                    onDelete={() => {
                        onDelete(item.id)
                    }}
                    isLoading={isBusy}
                />
                <div className="cart-item-subtotal">
                    <div className="subtotal-label">Subtotal</div>
                    <div className="subtotal-value">${lineTotal}</div>
                </div>
            </article>
        </Card>
    )
}
