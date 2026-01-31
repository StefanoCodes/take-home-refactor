import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth-helpers.server';
import { getUserRole } from '@/lib/data-access/auth/get-user-role';
import { LogoutButton } from './logout-button';

export async function NavAuthUser() {
  const { isLoggedIn, user } = await isAuthenticated();

  if (!isLoggedIn || !user) {
    return (
      <Link
        href="/login"
        className="rounded bg-[--color-primary] px-4 py-2 text-sm text-white hover:bg-[--color-primary-hover]"
      >
        Login
      </Link>
    );
  }

  const { role } = await getUserRole(user.id);

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-[--color-muted]">
        {user.name} {role && `(${role})`}
      </span>
      <LogoutButton />
    </div>
  );
}
