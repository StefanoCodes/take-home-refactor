'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateAdSlotForm } from './create-ad-slot-form';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface Props {
  publisherId: string;
}

export function CreateAdSlotButton({ publisherId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Create ad slot
          <Plus className="size-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create ad slot</DialogTitle>
        </DialogHeader>
        <CreateAdSlotForm publisherId={publisherId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
