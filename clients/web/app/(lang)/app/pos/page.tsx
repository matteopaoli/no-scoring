import POSTable from './POSTable';
import getUserFromAuth from '@/app/utils/getUserFromAuth';
import { UserService } from '@/app/services/userService';


export default async function ProductsPage({ searchParams }) {
    const user = await getUserFromAuth();   
    const store = (await UserService.getStores(user))[0];
    const pos = await UserService.getAllPos(store.id);
    return (
        <>
            <POSTable tableData={pos} />
        </>
    )
}