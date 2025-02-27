// import { getProduct } from "@/app/db"
// import { redirect } from "next/navigation"
// import Client from './page.client'
// import Stripe from "stripe"

// export default async function EditProductPage({ params }: { params: { productId: string } }) {
//     const user = await getUserFromAuth();
//     const stripe = new Stripe(user.stripeSecretKey)
//     const product = await stripe.products.retrieve(params.productId)
//     const price = await stripe.prices.retrieve(product.default_price as string)
    
//     if (!product) {
//         redirect('/app/products')
//     }
//     return (
//         <>
//          <Client product={product} price={price.unit_amount} />
//         </>
//     )
// }