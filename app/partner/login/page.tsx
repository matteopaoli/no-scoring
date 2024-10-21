import { DictionaryProvider } from "@/app/DictionaryProvider";
import SignIn from "./login";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user.role === "partner") {
    redirect("/partner");
  }

  return (
    <DictionaryProvider>
      <SignIn />
    </DictionaryProvider>
  );
}
