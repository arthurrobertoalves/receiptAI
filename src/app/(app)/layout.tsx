import { redirect } from 'next/navigation';
import { getSessionUser, toPublicUser } from '@/lib/auth';
import { TopAppBar } from '@/components/shell/TopAppBar';
import { DesktopSidebar } from '@/components/shell/DesktopSidebar';
import { MobileNav } from '@/components/shell/MobileNav';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  const publicUser = toPublicUser(user);

  return (
    <div className="min-h-screen">
      <TopAppBar user={publicUser} />
      <DesktopSidebar user={publicUser} />
      <main className="pt-20 pb-32 md:pb-12 md:pl-72">
        <div className="max-w-6xl mx-auto px-5 md:px-10">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
