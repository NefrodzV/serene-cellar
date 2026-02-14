import React from 'react'
import { Button } from './Button'
import { Spinner } from './Spinner'
import { createClassName } from '../../utils'
export function QuantityStepper({
    quantity,
    min,
    max,
    onIncrement,
    onDecrement,
    isLoading,
    onDelete,
    variant,
}) {
    return (
        <div className={createClassName('quantity-stepper', variant)}>
            {onDelete && quantity === min ? (
                <Button
                    variant="stepper"
                    aria-label="Delete cart item"
                    type="button"
                    onClick={onDelete}
                >
                    <div className="button-icon-container delete">
                        <i class="fa-solid fa-trash"></i>
                    </div>
                </Button>
            ) : (
                <Button
                    variant="stepper"
                    disabled={quantity <= min}
                    onClick={onDecrement}
                >
                    <div className="button-icon-container">
                        <i className="fa-solid fa-arrow-down"></i>
                    </div>
                </Button>
            )}
            <div className="cart-item-quantity">
                <div
                    className="quantity-container"
                    style={{
                        width: `clamp(2ch, ${quantity?.length}ch, 7ch)`,
                    }}
                >
                    {isLoading ? <Spinner /> : <>{quantity}</>}
                </div>
            </div>

            <Button
                variant="stepper"
                disabled={quantity >= max}
                onClick={onIncrement}
            >
                <div className="button-icon-container">
                    <i className="fa-solid fa-arrow-up"></i>
                </div>
            </Button>
        </div>
    )
}
