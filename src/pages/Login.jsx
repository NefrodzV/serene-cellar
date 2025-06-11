import { GoogleLogin } from "@react-oauth/google"
import React from "react"
import { useGoogleAuth, useTwitterAuth } from "../hooks"
useTwitterAuth
export default function LoginPage() {
    const { authenticate: twitterAuthenticate } = useTwitterAuth()
    const { onSuccess, onError } = useGoogleAuth()
    return <div>
        <h1>Login</h1>
        <GoogleLogin onSuccess={onSuccess} onError={onError}/>
        <button  type="button" onClick={twitterAuthenticate}>Login with X</button>
    </div>
}