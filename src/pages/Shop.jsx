import React from "react"
import { ProductList } from "../components"
export default function ShopPage() {
    return <>
    <header>
        <div>Logo</div>
        <nav>
            {/* TODO: USE ELEMENTS HERE FOR NAVIGATION FROM REACT ROUTER */}
            <a href="http://">Home</a>
            <a href="http://">Login</a>
            <a href="http://">Cart</a>
        </nav>
        <main>Product Catalog here
            <br />
            <ProductList />
        </main>
    </header>
    </>
}