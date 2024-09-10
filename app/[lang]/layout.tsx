import { DictionaryProvider } from './DictionaryProvider';

let title = 'Next.js + Postgres Auth Starter';
let description =
  'This is a Next.js starter kit that uses NextAuth.js for simple email + password login and a Postgres database to persist the data.';

export const metadata = {
  title,
  description,
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  metadataBase: new URL('https://nextjs-postgres-auth.vercel.app'),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <DictionaryProvider>
      {children}
    </DictionaryProvider>
  );
}
