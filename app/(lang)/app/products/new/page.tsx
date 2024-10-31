import { getStoreByUserId } from "@/app/db";
import Client from "./page.client";
import getUserFromAuth from "@/app/utils/getUserFromAuth";

export default async function CreateProductPage() {
  const user = await getUserFromAuth();
  const store = await getStoreByUserId(user.id);

  return (
    <Client storeImage={store.image} />
  )
}