import { getUser } from '@/app/db';
import { auth } from 'app/auth';
import Stripe from 'stripe'
import ProductsTable from './ProductsTable';


export default async function ProductsPage({ searchParams }: { searchParams: { startingAfter: string } }) {
    let session = await auth();
    const user = await getUser(session?.user?.email!)
    
    const stripe = new Stripe(user.stripeSecretKey)
    const { data } = await stripe.products.list({ starting_after: searchParams.startingAfter, limit: 10, active: true })
    const products = data.filter(x => x.name !== 'Prodotto generico')
  
    return (
        <>
            <ProductsTable tableData={products} />
        </>
    )
}