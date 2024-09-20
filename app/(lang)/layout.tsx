import { DictionaryProvider } from "@/app/DictionaryProvider";
import { UserContextProvider } from "../contexts/UserContext";
import { auth } from "../auth";

let title = "Next.js + Postgres Auth Starter";
let description =
  "This is a Next.js starter kit that uses NextAuth.js for simple email + password login and a Postgres database to persist the data.";

export const metadata = {
  title,
  description,
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <UserContextProvider value={session}>
      <DictionaryProvider>{children}</DictionaryProvider>
    </UserContextProvider>
  );
}
