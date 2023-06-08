import { requireSession } from '@/lib/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  await requireSession();
  return <div>{children}</div>;
}
