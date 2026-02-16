import React from 'react'
import { Button } from '../components/ui'
import { Link } from 'react-router-dom'
import { StatusPage } from '../components/status'
export function CheckoutSuccessPage() {
    return (
        <StatusPage
            status="success"
            title="Payment successful"
            description="Thank you for your purchase. Your order is now being prepared."
            actions={[
                {
                    to: '/profile',
                    label: 'View order',
                },
                { to: '/shop', label: 'Go home' },
            ]}
        />
    )
}
