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
import { createAdSlotAction } from '@/lib/server-actions/ad-slots/create-ad-slot';
import { createAdSlotInputSchema, type CreateAdSlotSchemaType } from '@/lib/validations/ad-slots';
import { adSlotTypeValues } from '@anvara/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
  publisherId: string;
  onSuccess?: () => void;
}

export function CreateAdSlotForm({ publisherId, onSuccess }: Props) {
  const router = useRouter();

  const form = useForm<CreateAdSlotSchemaType>({
    resolver: zodResolver(createAdSlotInputSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'DISPLAY',
      basePrice: 100,
      publisherId,
    },
  });

  const isPending = form.formState.isSubmitting;

  const onSubmit = async (data: CreateAdSlotSchemaType) => {
    try {
      const result = await createAdSlotAction(data);
      const { data: payload, serverError } = result;

      if (serverError || !payload?.success) {
        return toast.error(payload?.message ?? serverError ?? 'Failed to create ad slot');
      }

      toast.success(payload.message);
      onSuccess?.();
      router.refresh();
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create ad slot');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <FormField
          control={form.control}
          name="publisherId"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {isPending ? 'Creating...' : 'Create ad slot'}
        </Button>
      </form>
    </Form>
  );
}
