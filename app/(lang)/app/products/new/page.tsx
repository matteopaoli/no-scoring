import { getStoreByUserId, getUser } from "@/app/db";
import Client from "./page.client";
import { auth } from "@/app/auth";

export default async function CreateProductPage() {
  const session = await auth()
  const user = await getUser(session?.user?.email)

  const store = await getStoreByUserId(user.id)
  return (
    <Client storeImage={store.image} />
  )
}