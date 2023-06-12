import { type Metadata } from 'next';
import { Work_Sans } from 'next/font/google';

import './globals.css';

const font = Work_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Runner',
  description: 'Keep track of your progress',
  manifest: '/manifest.webmanifest',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
