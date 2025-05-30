import { GoogleLogin } from "@react-oauth/google"
import React from "react"

const sereneCellarApiUrl = import.meta.env.VITE_SERENE_CELLAR_API_URL

export default function LoginPage() {
    return <div>
        <h1>Login</h1>
        <GoogleLogin onSuccess={({credential}) => {
            console.log(credential)
            fetch(sereneCellarApiUrl + "/auth/google", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({idToken: credential})
            })
            .then(response => {
                if(!response.ok) {
                    console.error('Network response not ok')
                    return response.json()
                }
                return response.json()
            })
            .then(data => {
                console.log('User google authenticated', data)
            }, )
            .catch(error => {
                console.error(error)
            })
        }} onError={error => {
            console.error('Google login failed: ', error)
        }}/>
    </div>
}