import { type Metadata } from 'next';
import { Work_Sans } from 'next/font/google';

import { env } from '@/env.mjs';

import { SessionCheck } from './SessionCheck';
import './globals.css';

const font = Work_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.NODE_ENV === 'production' ? 'https://' : 'http://'}${env.VERCEL_URL}`),

  title: 'Runner',
  description: 'Keep track of your progress',
  applicationName: 'Runner',
  manifest: '/manifest.webmanifest',
  themeColor: '#d1fae5',
  appleWebApp: {
    title: 'Runner',
    statusBarStyle: 'black-translucent',
  },
  referrer: 'origin-when-cross-origin',
  keywords: ['Running', 'Habits'],
  authors: [{ name: 'Adam Bergman', url: 'https://www.fransvilhelm.com' }],
  colorScheme: 'light',
  creator: 'Adam Bergman',
  publisher: 'Adam Bergman',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={font.className}>
        <SessionCheck />
        {children}
      </body>
    </html>
  );
}
