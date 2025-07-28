import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

export function useCart() {
    const context = useContext(CartContext)
    const errorMsg = 'useCart must be used in a Cart Provider'
    if(!context) {
        throw new Error(errorMsg)
    }

    return context
}