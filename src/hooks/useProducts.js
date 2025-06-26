import { useEffect, useState } from "react";
import { useLoading } from "./useLoading";

export function useProducts() {
    const [products, setProducts] = useState([])
    const isLoading = useLoading(products)

    useEffect(() => {
        async function getProducts() {
            const apiUrl = import.meta.env.VITE_SERENE_CELLAR_API_URL
            try {
                const response = await fetch(apiUrl + '/products')
                const data = await response.json()
                if(!response.ok) {
                    return console.error('Get products response error:', data)
                }
                setProducts(data)
            } catch (e) {
                console.error('Some error happened fetching products:', e)
            } 
        }

        getProducts()
    },[])

    return [products, isLoading]
}