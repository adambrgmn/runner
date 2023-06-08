import { getServerSession } from 'next-auth/next';
import { Inter } from 'next/font/google';

import { options } from '@/lib/auth';
import { SessionProvider } from '@/lib/auth.client';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Runner',
  description: 'Keep track of your progress',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession(options);

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </SessionProvider>
  );
}
