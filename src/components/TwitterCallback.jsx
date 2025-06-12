import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
export default function TwitterCallback() {
    const[searchParams] = useSearchParams()
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    useEffect(() => {
        const authenticate = async () => {
            try {
                const code_verifier = localStorage.getItem('code_verifier')
                console.log(code_verifier)
                const response = await fetch('http://localhost:3000/auth/twitter', {
                    method: 'post',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        code,
                        state,
                        code_verifier
                    })
                })
                if(!response.ok) {
                    console.error(await response.json())
                    return
                }
            } catch(error) {
                console.error('Twitter callback authentication -> ', error)
            }
        } 
        authenticate()
    },[])
    return <p>Login you in to your account please wait...</p>
}