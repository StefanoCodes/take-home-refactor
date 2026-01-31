import { isAuthenticated } from '@/lib/auth-helpers.server';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/auth/login-form';
import { getUserRole } from '@/lib/data-access/auth/get-user-role';

export default async function LoginPage() {
  const { user } = await isAuthenticated();

  if (user) {
    const { role } = await getUserRole(user.id);
    if (role === 'sponsor') {
      return redirect('/dashboard/sponsor');
    } else if (role === 'publisher') {
      return redirect('/dashboard/publisher');
    }
    return redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[--color-background]">
      <div className="w-full max-w-md rounded-lg border border-[--color-border] p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">Login to Anvara</h1>
        <LoginForm />
      </div>
    </div>
  );
}
