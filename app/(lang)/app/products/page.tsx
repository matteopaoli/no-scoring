import Stripe from 'stripe'
import ProductsTable from './ProductsTable';
import getUserFromAuth from '@/app/utils/getUserFromAuth';


export default async function ProductsPage({ searchParams }) {
    const user = await getUserFromAuth();
    
    const stripe = new Stripe(user.stripeSecretKey)
    const { data } = await stripe.products.list({ active: true, limit: 1000 })
    const products = data.filter(x => x.id !== user.genericProductId)
    return (
        <>
            <ProductsTable tableData={products} />
        </>
    )
}