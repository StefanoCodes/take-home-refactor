import { isAuthenticated } from '@/lib/auth-helpers.server';
import { getUserRole } from '@/lib/data-access-layer/auth/get-user-role';
import { NavLinks } from './nav-links';
import { NavAuthUser } from './nav-auth-user';
import { Logo } from '@/components/global/logo';
import { ModeToggle } from '@/components/ui/theme-toggle';

export async function Nav() {
  const { isLoggedIn, user } = await isAuthenticated();
  let role: 'sponsor' | 'publisher' | null = null;

  if (isLoggedIn && user) {
    const result = await getUserRole(user.id);
    role = result.role;
  }

  return (
    <header className="border-b fixed top-0 left-0 right-0 z-50 border-border bg-background">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-0">
        <Logo />

        <div className="flex items-center gap-6">
          <NavLinks role={role} />
          <NavAuthUser />
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
