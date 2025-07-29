import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const commentSchema = z.object({
  text: z.string().min(1, 'Comment cannot be empty.').max(500, 'Comment is too long.'),
});

const CommentForm = ({ projectId }) => {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: { text: '' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (newComment) => apiClient.post(`/projects/${projectId}/comments`, newComment),
    onSuccess: (data) => {
      toast.success('Comment posted!');
      queryClient.setQueryData(['project', projectId], (oldData) => {
        return oldData ? { ...oldData, comments: [...oldData.comments, data.data] } : oldData;
      });
      form.reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to post comment.');
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Share your thoughts on this project..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Posting...' : 'Post Comment'}
        </Button>
      </form>
    </Form>
  );
};

export default CommentForm;