import { UserContextProvider } from "../contexts/UserContext";
import { auth } from "../auth";

let title = "PayTomorrow";

export const metadata = {
  title,
  twitter: {
    card: "summary_large_image",
    title,
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
      {children}
    </UserContextProvider>
  );
}
