import { useProduct } from "../../hooks";

export function ProductView() {
    const [product, isLoading] = useProduct()
    return (
        <h1>Product View</h1>
    //     <article>
    //     <img 
    // width={500} // This should be controlled by css
    // srcSet={`${images.phone} 360w, ${images.tablet} 720w, ${images.desktop} 1080w`}
    // sizes={`(max-width: 600px) 360px, (max-width: 1024px) 720px, 1080px`}
    // /> 
    // <h1></h1></article>
    )
}