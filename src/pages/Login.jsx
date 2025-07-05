import { GoogleLogin } from '@react-oauth/google'
import React from 'react'
import { useGoogleAuth, useTwitterAuth } from '../hooks'
export function LoginPage() {
    const { authenticate: twitterAuthenticate } = useTwitterAuth()
    const { onSuccess, onError } = useGoogleAuth()
    return (
        <div>
            <div
                style={{
                    width: '180px',
                    height: '240px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                }}
            >
                <img
                    src={desktopImage}
                    alt="Beer"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                    }}
                />
            </div>
            <div
                style={{
                    width: '180px',
                    height: '240px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid black',
                }}
            >
                <img
                    src={smallImage}
                    alt="Beer"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                    }}
                />
            </div>
            <h1>Login</h1>
            <GoogleLogin onSuccess={onSuccess} onError={onError} />
            <button type="button" onClick={twitterAuthenticate}>
                Login with X
            </button>
        </div>
    )
}
