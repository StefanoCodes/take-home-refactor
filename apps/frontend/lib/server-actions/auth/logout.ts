'use server';

import { auth } from '@/lib/auth-client.server';
import { actionClient, ActionError } from '@/lib/action-client';
import { headers } from 'next/headers';

export const logoutAction = actionClient
  .metadata({
    actionName: 'logout',
    actionDescription: 'Sign out the current user',
  })
  .action(async () => {
    try {
      await auth.api.signOut({
        headers: await headers(),
      });

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      throw new ActionError(
        error instanceof Error ? error.message : 'An error occurred during logout'
      );
    }
  });
