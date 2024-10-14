import { getUser } from '@/app/db';
import { auth } from 'app/auth';
import Stripe from 'stripe'
import ProductsTable from './ProductsTable';


export default async function ProductsPage({ searchParams }) {
    let session = await auth();
    const user = await getUser(session?.user?.email!)
    
    const stripe = new Stripe(user.stripeSecretKey)
    const { data } = await stripe.products.list({ active: true, limit: 1000 })
    const products = data.filter(x => x.id !== user.genericProductId)
    return (
        <>
            <ProductsTable tableData={products} />
        </>
    )
}