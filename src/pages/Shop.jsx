import React from 'react'
import { ProductList } from '../components'
import { Link } from 'react-router-dom'

export function ShopPage() {
    return (
        <>
            <header>
                <div>Logo</div>
                <nav>
                    {/* TODO: USE ELEMENTS HERE FOR NAVIGATION FROM REACT ROUTER */}
                    <a href="http://">Home</a>
                    <a href="http://">Login</a>
                    <Link to={'/cart'}>Cart</Link>
                </nav>
                <main>
                    Product Catalog here
                    <br />
                    <ProductList />
                </main>
            </header>
        </>
    )
}
