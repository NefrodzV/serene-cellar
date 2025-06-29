import { useState } from "react";

export function useProductSelection(price = {}) {
    const [packSize, setPackSize] = useState(Object.keys(price).at(0))
    const [quantity, setQuantity] = useState(1)

    function packSizeHandler(e) {
        setPackSize(e.target.value)
    }
    function quantityHandler(e) {
        setQuantity(e.target.value)
    }
    return {
        packSize, 
        quantity, 
        packSizeHandler, 
        quantityHandler, 
        total: (price[packSize].value * quantity).toFixed(2)
    }
}