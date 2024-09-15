import { getBusinessTypes } from '@/app/db'
import Client from './page.client'
export default async function CreateUserPage() {
    const businessTypes = await getBusinessTypes()
    const businessTypesOptions = businessTypes.map((b) => <option value={b.id}>{b.name}</option>)

    return (
        <Client businessTypesOptions={businessTypesOptions} />
    )
}