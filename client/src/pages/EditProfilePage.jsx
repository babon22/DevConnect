import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  bio: z.string().max(300, 'Bio must be 300 characters or less.').optional(),
  location: z.string().optional(),
  avatarUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

const EditProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      bio: user?.profile?.bio || '',
      location: user?.profile?.location || '',
      avatarUrl: user?.profile?.avatarUrl || '',
      github: user?.profile?.socialLinks?.github || '',
      linkedin: user?.profile?.socialLinks?.linkedin || '',
      website: user?.profile?.socialLinks?.website || '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (updatedProfile) => apiClient.put('/users/profile', updatedProfile),
    onSuccess: (data) => {
      toast.success('Profile updated successfully!');
      // Update user in auth context and local storage
      setUser(prev => ({ ...prev, ...data.data }));
      queryClient.invalidateQueries({ queryKey: ['user', user._id] });
      navigate(`/users/${user._id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Your Profile</CardTitle>
          <CardDescription>Keep your profile information up to date.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
              <FormField control={form.control} name="bio" render={({ field }) => ( <FormItem> <FormLabel>Bio</FormLabel> <FormControl><Textarea placeholder="A short bio about yourself" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
              <FormField control={form.control} name="location" render={({ field }) => ( <FormItem> <FormLabel>Location</FormLabel> <FormControl><Input placeholder="City, Country" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
              <FormField control={form.control} name="avatarUrl" render={({ field }) => ( <FormItem> <FormLabel>Avatar URL</FormLabel> <FormControl><Input placeholder="https://..." {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
              <h3 className="text-lg font-medium pt-4 border-t">Social Links</h3>
              <FormField control={form.control} name="github" render={({ field }) => ( <FormItem> <FormLabel>GitHub</FormLabel> <FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
              <FormField control={form.control} name="linkedin" render={({ field }) => ( <FormItem> <FormLabel>LinkedIn</FormLabel> <FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
              <FormField control={form.control} name="website" render={({ field }) => ( <FormItem> <FormLabel>Website/Portfolio</FormLabel> <FormControl><Input placeholder="https://..." {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfilePage;