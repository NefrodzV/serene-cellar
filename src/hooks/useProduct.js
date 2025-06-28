import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useLoading } from "./useLoading";
import { API_URL } from "../config";
export function useProduct() {
    const location = useLocation()
    const { name } = useParams()
    const [product, setProduct] = useState(location.state?.product || null)
    const isLoading = useLoading(product)
    useEffect(() => {
        async function getProductWithSlug() {
            const slug = name
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
            try {
                const response = await fetch(`${API_URL}/products/${slug}`)
                const data = await response.json()

                if(!response.ok) {
                    return console.error('Error response:', data.errors.map((error) => `${error.msg}`))
                }
                setProduct(data)
            } catch(e) {
                console.error('GET product with slug error:', e)
            }
        }

        if(!product) getProductWithSlug()
        
    },[name, product])

    return [product, isLoading]
}