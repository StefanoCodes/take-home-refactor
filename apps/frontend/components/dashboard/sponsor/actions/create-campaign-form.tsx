'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { createCampaignAction } from '@/lib/server-actions/campaigns/create-campaign';
import {
  createCampaignInputSchema,
  type CreateCampaignSchemaType,
} from '@/lib/validations/campaigns';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
  sponsorId: string;
  onSuccess?: () => void;
}

export function CreateCampaignForm({ sponsorId, onSuccess }: Props) {
  const router = useRouter();

  const form = useForm<CreateCampaignSchemaType>({
    resolver: zodResolver(createCampaignInputSchema),
    defaultValues: {
      name: '',
      description: '',
      budget: 1000,
      startDate: '',
      endDate: '',
      sponsorId,
    },
  });

  const isPending = form.formState.isSubmitting;

  const onSubmit = async (data: CreateCampaignSchemaType) => {
    try {
      const result = await createCampaignAction(data);
      const { data: payload, serverError } = result;

      if (serverError || !payload?.success) {
        return toast.error(payload?.message ?? serverError ?? 'Failed to create campaign');
      }

      toast.success(payload.message);
      onSuccess?.();
      router.refresh();
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create campaign');
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
            render={({ field }) => {
              const dateValue = field.value ? new Date(field.value + 'T00:00:00') : undefined;
              return (
                <FormItem>
                  <FormLabel>Start date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="secondary" className="w-full justify-start font-normal">
                          {dateValue ? dateValue.toLocaleDateString() : 'Select date'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateValue}
                        defaultMonth={dateValue}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          field.onChange(date ? date.toISOString().slice(0, 10) : '');
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => {
              const dateValue = field.value ? new Date(field.value + 'T00:00:00') : undefined;
              return (
                <FormItem>
                  <FormLabel>End date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="secondary" className="w-full justify-start font-normal">
                          {dateValue ? dateValue.toLocaleDateString() : 'Select date'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateValue}
                        defaultMonth={dateValue}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          field.onChange(date ? date.toISOString().slice(0, 10) : '');
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <FormField
          control={form.control}
          name="sponsorId"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create campaign'}
          {isPending && <Loader2 className="size-4 ml-2 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
