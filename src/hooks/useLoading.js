import { useEffect, useState } from "react";

export function useLoading(observedData) {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if(observedData) return setIsLoading(false)
        
    },[observedData])

    return isLoading
}