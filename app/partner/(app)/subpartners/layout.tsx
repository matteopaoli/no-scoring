import { auth } from "@/app/auth";
import { getUser } from "@/app/db";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: JSX.Element[];
}) {
  const session = await auth();
  const { role } = await getUser(session?.user?.email);
  if (role === "partner") return children;
  redirect("/partner");
}
