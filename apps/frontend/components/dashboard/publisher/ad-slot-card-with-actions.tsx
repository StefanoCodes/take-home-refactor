'use client';

import { Button } from '@/components/ui/button';
import {
  AdSlotCardRoot,
  AdSlotCardHeader,
  AdSlotCardTypeBadge,
  AdSlotCardFooter,
} from '@/components/dashboard/marketplace/ad-slot-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { deleteAdSlotAction } from '@/lib/server-actions/ad-slots/delete-ad-slot';
import type { AdSlotListItem } from '@anvara/schemas';
import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { UpdateAdSlotForm } from './actions/update-ad-slot-form';

interface Props {
  adSlot: AdSlotListItem;
}

export function AdSlotCardWithActions({ adSlot }: Props) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  const handleDelete = async () => {
    setDeletePending(true);
    try {
      const result = await deleteAdSlotAction({ adSlotId: adSlot.id });
      const { data: payload, serverError } = result;

      if (serverError || !payload?.success) {
        toast.error(payload?.message ?? serverError ?? 'Failed to delete ad slot');
        return;
      }

      toast.success(payload.message);
      setDeleteOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete ad slot');
    } finally {
      setDeletePending(false);
    }
  };

  return (
    <div>
      <AdSlotCardRoot>
        <AdSlotCardHeader>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <h3 className="font-semibold">{adSlot.name}</h3>
            <AdSlotCardTypeBadge type={adSlot.type} />
          </div>
          <div className="flex shrink-0 flex-row items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditOpen(true)}
              className="min-w-0! border-0! bg-blue-500/5 px-1.5! py-1.5! text-blue-500 hover:bg-blue-500/15 hover:text-blue-400"
              aria-label="Edit ad slot"
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeleteOpen(true)}
              className="min-w-0! border-0! bg-red-500/5 px-1.5! py-1.5! text-red-500 hover:bg-red-500/15 hover:text-red-400"
              aria-label="Delete ad slot"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </AdSlotCardHeader>

        {adSlot.description && (
          <p className="mb-3 text-sm text-text-muted line-clamp-2">{adSlot.description}</p>
        )}

        <AdSlotCardFooter>
          <span className={`text-sm ${adSlot.isAvailable ? 'text-green-400' : 'text-text-muted'}`}>
            {adSlot.isAvailable ? 'Available' : 'Booked'}
          </span>
          <span className="font-semibold text-brand-primary">
            ${Number(adSlot.basePrice).toLocaleString()}/mo
          </span>
        </AdSlotCardFooter>
      </AdSlotCardRoot>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit ad slot</DialogTitle>
          </DialogHeader>
          <UpdateAdSlotForm adSlot={adSlot} onSuccess={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete ad slot</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-text-muted">
            Are you sure you want to delete &quot;{adSlot.name}&quot;? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeleteOpen(false)}
              disabled={deletePending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleDelete}
              disabled={deletePending}
              className="bg-red-600 hover:opacity-90"
            >
              {deletePending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
