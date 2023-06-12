import Image from 'next/image';

import { requireSession } from '@/lib/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await requireSession();
  return (
    <div>
      <Header name={session.user?.name} profile={session.user?.image} />
      {children}
    </div>
  );
}

interface HeaderProps {
  name: string | undefined | null;
  profile: string | undefined | null;
}

function Header({ name, profile }: HeaderProps) {
  return (
    <header className="flex items-center gap-3 p-5">
      {profile != null ? (
        <Image src={profile} alt={name ?? ''} width={36} height={36} className="rounded-full" />
      ) : null}
      <span className="text-sm text-stone-500">Hello {name ?? 'there'} 👋</span>
    </header>
  );
}
