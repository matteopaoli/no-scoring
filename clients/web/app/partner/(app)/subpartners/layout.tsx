import getUserFromAuth from "@/app/utils/getUserFromAuth";
import { redirect } from "next/navigation";

import type { JSX } from "react";

export default async function Layout({
  children,
}: {
  children: JSX.Element[];
}) {
  const { role } = await getUserFromAuth()
  if (role === "partner") return children;
  redirect("/partner");
}
