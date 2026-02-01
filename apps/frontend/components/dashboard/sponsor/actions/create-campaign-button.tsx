'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateCampaignForm } from './create-campaign-form';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface Props {
  sponsorId: string;
}

export function CreateCampaignButton({ sponsorId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Create campaign
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create campaign</DialogTitle>
        </DialogHeader>
        <CreateCampaignForm sponsorId={sponsorId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
