import React from 'react'
import { StatusPage } from '../components/status'

export function RegisterSuccessPage() {
    return (
        <StatusPage
            title="Registration successful"
            description="Your account has been created. You can now log in and start shopping."
            status="success"
            actions={[{ to: '/login', label: 'Go to login' }]}
        />
    )
}
