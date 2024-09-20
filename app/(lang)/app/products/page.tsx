import { getUser } from '@/app/db';
import { auth } from 'app/auth';
import Stripe from 'stripe'
import ProductsTable from './ProductsTable';

export default async function ProductsPage() {
    let session = await auth();
    const user = await getUser(session?.user?.email!)
    
    const stripe = new Stripe(user.stripeSecretKey)
    const { data: products } = await stripe.products.list()
  
    return (
        <>
        <ProductsTable tableData={products} />
        </>
    )
}