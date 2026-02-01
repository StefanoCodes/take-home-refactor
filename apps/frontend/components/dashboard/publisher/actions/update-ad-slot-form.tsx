'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { updateAdSlotAction } from '@/lib/server-actions/ad-slots/update-ad-slot';
import {
  updateAdSlotFormSchema,
  type UpdateAdSlotFormSchemaType,
} from '@/lib/validations/ad-slots';
import { adSlotTypeValues, type AdSlotListItem } from '@anvara/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
  adSlot: AdSlotListItem;
  onSuccess?: () => void;
}

export function UpdateAdSlotForm({ adSlot, onSuccess }: Props) {
  const router = useRouter();

  const form = useForm<UpdateAdSlotFormSchemaType>({
    resolver: zodResolver(updateAdSlotFormSchema),
    defaultValues: {
      adSlotId: adSlot.id,
      name: adSlot.name ?? '',
      description: adSlot.description ?? '',
      type: adSlot.type,
      basePrice: Number(adSlot.basePrice) || 0,
    },
  });

  const isPending = form.formState.isSubmitting;

  const onSubmit = async (data: UpdateAdSlotFormSchemaType) => {
    try {
      const result = await updateAdSlotAction(data);
      const { data: payload, serverError } = result;

      if (serverError || !payload?.success) {
        return toast.error(payload?.message ?? serverError ?? 'Failed to update ad slot');
      }

      toast.success(payload.message);
      onSuccess?.();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update ad slot');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="adSlotId"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Ad slot name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Brief description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {adSlotTypeValues.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="basePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base price ($/mo)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="Base price"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save changes'}
          {isPending && <Loader2 className="size-4 ml-2 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
