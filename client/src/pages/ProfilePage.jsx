import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectCard } from '@/features/projects/ProjectCard';
import { Github, Linkedin, Link as LinkIcon, MapPin, Pencil } from 'lucide-react';

const fetchUser = async (userId) => {
  const { data } = await apiClient.get(`/users/${userId}`);
  return data;
};

const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
  });

  if (isLoading) return <ProfileSkeleton />;
  if (isError) return <div className="text-destructive text-center py-10">{error.response?.data?.message || error.message}</div>;

  const isOwnProfile = currentUser?._id === user._id;

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1 space-y-6">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.profile.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            {user.profile.location && (
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <span>{user.profile.location}</span>
              </div>
            )}
            {isOwnProfile && (
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/profile/edit" className="flex items-center gap-2">
                  <Pencil className="h-3 w-3" />
                  Edit Profile
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>About</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{user.profile.bio || 'No bio yet.'}</p>
            <div className="flex gap-4 mt-4">
              {user.profile.socialLinks?.github && <a href={user.profile.socialLinks.github} target="_blank" rel="noopener noreferrer"><Github /></a>}
              {user.profile.socialLinks?.linkedin && <a href={user.profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin /></a>}
              {user.profile.socialLinks?.website && <a href={user.profile.socialLinks.website} target="_blank" rel="noopener noreferrer"><LinkIcon /></a>}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4">Projects ({user.projects.length})</h2>
        {user.projects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {user.projects.map((project) => (
              <ProjectCard key={project._id} project={{...project, author: user}} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">This user hasn't posted any projects yet.</p>
        )}
      </div>
    </div>
  );
};

const ProfileSkeleton = () => (
    <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
            <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                    <Skeleton className="h-24 w-24 rounded-full mb-4" />
                    <Skeleton className="h-8 w-40 mb-2" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-9 w-32 mt-4" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader><Skeleton className="h-7 w-24" /></CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    </div>
)

export default ProfilePage;