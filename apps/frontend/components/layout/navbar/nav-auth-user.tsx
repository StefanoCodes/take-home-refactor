import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth-helpers.server';
import { getUserRole } from '@/lib/data-access/auth/get-user-role';
import { LogoutButton } from './logout-button';
import { Button } from '@/components/ui/button';

export async function NavAuthUser() {
  const { isLoggedIn, user } = await isAuthenticated();

  if (!isLoggedIn || !user) {
    return (
      <Button asChild variant="primary" className="px-4 py-2 text-sm">
        <Link href="/login">Login</Link>
      </Button>
    );
  }

  const { role } = await getUserRole(user.id);

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-text-muted">
        {user.name} {role && `(${role})`}
      </span>
      <LogoutButton />
    </div>
  );
}
