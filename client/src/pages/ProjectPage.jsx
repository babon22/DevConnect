import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Github, Link as LinkIcon } from 'lucide-react';
import CommentList from '@/features/projects/CommentList';
import CommentForm from '@/features/projects/CommentForm';
import { useAuth } from '@/hooks/useAuth';

const fetchProject = async (projectId) => {
  const { data } = await apiClient.get(`/projects/${projectId}`);
  return data;
};

const ProjectPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { data: project, isLoading, isError, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id),
  });

  if (isLoading) return <ProjectSkeleton />;
  if (isError) return <div className="text-destructive text-center py-10">{error.response?.data?.message || error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tighter mb-2">{project.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <Link to={`/users/${project.author._id}`} className="flex items-center gap-2 group">
            <Avatar className="h-8 w-8">
              <AvatarImage src={project.author.profile?.avatarUrl} alt={project.author.name} />
              <AvatarFallback>{project.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium group-hover:text-foreground">{project.author.name}</span>
          </Link>
          <span>•</span>
          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
      </header>

      {/* The "prose-invert" class has been removed from the line below */}
      <div className="prose max-w-none mb-8">
        <p>{project.description}</p>
      </div>

      <div className="flex gap-4 mb-12">
        {project.projectUrl && <Button asChild><a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2"><LinkIcon className="h-4 w-4" /> Live Demo</a></Button>}
        {project.repoUrl && <Button asChild variant="secondary"><a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2"><Github className="h-4 w-4" /> Source Code</a></Button>}
      </div>

      <div className="border-t pt-8">
        <CommentList comments={project.comments} />
      </div>

      {isAuthenticated && (
        <div className="mt-8 border-t pt-8">
          <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>
          <CommentForm projectId={id} />
        </div>
      )}
    </div>
  );
};

const ProjectSkeleton = () => (
    <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-6 w-32" />
            </div>
        </div>
        <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
        </div>
        <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
        </div>
    </div>
)

export default ProjectPage;