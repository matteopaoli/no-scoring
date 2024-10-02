import './globals.css';

import { GeistSans } from 'geist/font/sans';
import Providers from './providers';

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
    <html lang="en">
      <body className={GeistSans.variable}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
