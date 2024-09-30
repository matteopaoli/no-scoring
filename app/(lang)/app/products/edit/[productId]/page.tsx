import { getProduct, getUser } from "@/app/db"
import { redirect } from "next/navigation"
import Client from './page.client'
import { auth } from "@/app/auth"
import Stripe from "stripe"

export default async function EditProductPage({ params }: { params: { productId: string } }) {
    const session = await auth()
    if (!session?.user?.email) {
        redirect('/app/products')
    }
    const user = await getUser(session.user.email)
    const stripe = new Stripe(user.stripeSecretKey)
    const product = await stripe.products.retrieve(params.productId)
    const price = await stripe.prices.retrieve(product.default_price as string)
    
    if (!product) {
        redirect('/app/products')
    }
    return (
        <>
         <Client product={product} price={price.unit_amount} />
        </>
    )
}