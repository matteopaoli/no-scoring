import './globals.css';
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
      <body style={{ backgroundColor: 'rgb(244 247 254)' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
