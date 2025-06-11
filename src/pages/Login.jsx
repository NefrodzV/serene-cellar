import { GoogleLogin } from "@react-oauth/google"
import React from "react"
import pkceChallenge ,{ generateChallenge } from "pkce-challenge"
const sereneCellarApiUrl = import.meta.env.VITE_SERENE_CELLAR_API_URL
const twitterClientId = import.meta.env.VITE_TWITTER_CLIENT_ID

export default function LoginPage() {
    
    const twitterAuthenticate = async () => {
        const { code_verifier, code_challenge } =  await pkceChallenge()
        localStorage.setItem('code_verifier', code_verifier)

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: twitterClientId,
            redirect_uri: 'https://a1f5-2606-6a40-7-6586-b7a9-839c-3e9b-31b4.ngrok-free.app/twitter/callback',
            scope: 'tweet.read users.read',
            state: 'Some random state',
            code_challenge: code_challenge,
            code_challenge_method: 'plain'
        })

    
        window.location.href  = `https://twitter.com/i/oauth2/authorize?${params.toString()}`
        
    }   
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
            })
            .catch(error => {
                console.error(error)
            })
        }} onError={error => {
            console.error('Google login failed: ', error)
        }}/>
        <button  type="button" onClick={twitterAuthenticate}>Login with X</button>
    </div>
}