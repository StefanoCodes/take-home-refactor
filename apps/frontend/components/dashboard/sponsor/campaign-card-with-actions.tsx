'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  CampaignCardRoot,
  CampaignCardHeader,
  CampaignCardTitle,
  CampaignCardStatusBadge,
  CampaignCardDescription,
  CampaignCardBudget,
  CampaignCardDateRange,
} from './campaign-card';
import { deleteCampaignAction } from '@/lib/server-actions/campaigns/delete-campaign';
import type { CampaignListItem } from '@anvara/schemas';
import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { UpdateCampaignForm } from './actions/update-campaign-form';

interface Props {
  campaign: CampaignListItem;
}

export function CampaignCardWithActions({ campaign }: Props) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  const handleDelete = async () => {
    setDeletePending(true);
    try {
      const result = await deleteCampaignAction({ campaignId: campaign.id });
      const { data: payload, serverError } = result;

      if (serverError || !payload?.success) {
        toast.error(payload?.message ?? serverError ?? 'Failed to delete campaign');
        return;
      }

      toast.success(payload.message);
      setDeleteOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete campaign');
    } finally {
      setDeletePending(false);
    }
  };

  return (
    <>
      <CampaignCardRoot>
        <CampaignCardHeader>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <CampaignCardTitle>{campaign.name}</CampaignCardTitle>
            <CampaignCardStatusBadge status={campaign.status} />
          </div>
          <div className="flex shrink-0 flex-row items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditOpen(true)}
              className="min-w-0! border-0! bg-blue-500/5 px-1.5! py-1.5! text-blue-500 hover:bg-blue-500/15 hover:text-blue-400"
              aria-label="Edit campaign"
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeleteOpen(true)}
              className="min-w-0! border-0! bg-red-500/5 px-1.5! py-1.5! text-red-500 hover:bg-red-500/15 hover:text-red-400"
              aria-label="Delete campaign"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </CampaignCardHeader>
        {campaign.description && (
          <CampaignCardDescription>{campaign.description}</CampaignCardDescription>
        )}
        <CampaignCardBudget spent={Number(campaign.spent)} budget={Number(campaign.budget)} />
        <CampaignCardDateRange startDate={campaign.startDate} endDate={campaign.endDate} />
      </CampaignCardRoot>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit campaign</DialogTitle>
          </DialogHeader>
          <UpdateCampaignForm campaign={campaign} onSuccess={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete campaign</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-text-muted">
            Are you sure you want to delete &quot;{campaign.name}&quot;? This action cannot be
            undone.
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
    </>
  );
}
