import './globals.css';
import Providers from './providers';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

let title = 'App | PayTomorrow';

export const metadata = {
  title,
  twitter: {
    card: 'summary_large_image',
    title,
  },
  metadataBase: new URL('https://app.paytomorrow.it'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body style={{ backgroundColor: 'rgb(244 247 254)' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

