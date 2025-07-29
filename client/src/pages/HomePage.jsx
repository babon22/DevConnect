import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { ProjectCard } from '@/features/projects/ProjectCard';
import { Skeleton } from "@/components/ui/skeleton"

const fetchProjects = async () => {
  const { data } = await apiClient.get('/projects');
  return data;
};

const HomePage = () => {
  const { data: projects, isLoading, isError, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  return (
    <div>
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Welcome to DevConnect</h1>
        <p className="text-muted-foreground md:text-xl/relaxed">
          The place where developers showcase their work and connect with each other.
        </p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-destructive">Error: {error.message}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

const CardSkeleton = () => (
    <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
    </div>
)

export default HomePage;