import React from 'react'
import { Button } from './Button'
import { Spinner } from './Spinner'
export function QuantityStepper({
    quantity,
    min,
    max,
    onIncrement,
    onDecrement,
    isLoading,
    onDelete,
}) {
    return (
        <div className="quantity-stepper">
            {onDelete && quantity === min ? (
                <Button
                    variant="transparent"
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
                    variant="transparent"
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
                variant="transparent"
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
