import React from 'react'
import { StatusPage } from '../components/status'

export function CheckoutCancelPage() {
    return (
        <StatusPage
            status="error"
            title="Payment Canceled"
            description="You can try again or continue shopping whenever you’re ready."
            actions={[
                {
                    to: '/cart',
                    label: 'View cart',
                },
                {
                    to: '/shop',
                    label: 'Go home',
                },
            ]}
        />
    )
}
