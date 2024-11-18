import Stripe from 'stripe'
import ProductsTable from './ProductsTable';
import getUserFromAuth from '@/app/utils/getUserFromAuth';


export default async function ProductsPage({ searchParams }) {
    const user = await getUserFromAuth();
    
    const stripe = new Stripe(process.env.STRIPE_API_KEY!, { stripeAccount: user.stripeUserId });
    const { data } = await stripe.products.list({ active: true, limit: 1000 })
    return (
        <>
            <ProductsTable tableData={data} />
        </>
    )
}