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
import { updateCampaignAction } from '@/lib/server-actions/campaigns/update-campaign';
import {
  updateCampaignFormSchema,
  type UpdateCampaignFormSchemaType,
} from '@/lib/validations/campaigns';
import { campaignStatusValues, type CampaignListItem } from '@anvara/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDateForInput } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
  campaign: CampaignListItem;
  onSuccess?: () => void;
}

export function UpdateCampaignForm({ campaign, onSuccess }: Props) {
  const router = useRouter();

  const form = useForm<UpdateCampaignFormSchemaType>({
    resolver: zodResolver(updateCampaignFormSchema),
    defaultValues: {
      campaignId: campaign.id,
      name: campaign.name ?? '',
      description: campaign.description ?? '',
      budget: Number(campaign.budget) || 0,
      startDate: formatDateForInput(campaign.startDate),
      endDate: formatDateForInput(campaign.endDate),
      status: campaign.status,
    },
  });

  const isPending = form.formState.isSubmitting;

  const onSubmit = async (data: UpdateCampaignFormSchemaType) => {
    try {
      const result = await updateCampaignAction(data);
      const { data: payload, serverError } = result;

      if (serverError || !payload?.success) {
        return toast.error(payload?.message ?? serverError ?? 'Failed to update campaign');
      }

      toast.success(payload.message);
      onSuccess?.();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update campaign');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="campaignId"
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
                <Input placeholder="Campaign name" {...field} />
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
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="Budget"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {campaignStatusValues.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
