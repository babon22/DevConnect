import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { ProjectCard } from '@/features/projects/ProjectCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const searchAll = async (query) => {
    if (!query) return { projects: [], users: [] };
    const [projectRes, userRes] = await Promise.all([
        apiClient.get(`/projects/search?q=${query}`),
        apiClient.get(`/users/search?q=${query}`)
    ]);
    return { projects: projectRes.data, users: userRes.data };
};

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['search', query],
        queryFn: () => searchAll(query),
        enabled: !!query,
    });

    if (isLoading) return <SearchSkeleton query={query} />;

    if (isError) return <div className="text-destructive">Error: {error.message}</div>;

    if (!query) return <div className="text-center text-muted-foreground">Please enter a search term.</div>;

    const noResults = data?.projects.length === 0 && data?.users.length === 0;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>
            {noResults ? (
                <p className="text-muted-foreground">No results found.</p>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-semibold">Projects ({data?.projects.length})</h2>
                        {data?.projects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {data.projects.map(project => <ProjectCard key={project._id} project={project} />)}
                            </div>
                        ) : <p className="text-muted-foreground">No projects found.</p>}
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold">Users ({data?.users.length})</h2>
                        {data?.users.length > 0 ? (
                            <div className="space-y-4">
                                {data.users.map(user => <UserCard key={user._id} user={user} />)}
                            </div>
                        ) : <p className="text-muted-foreground">No users found.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

const UserCard = ({ user }) => (
    <Card>
        <CardContent className="p-4 flex items-center gap-4">
            <Avatar>
                <AvatarImage src={user.profile.avatarUrl} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <Link to={`/users/${user._id}`} className="font-semibold hover:underline">{user.name}</Link>
                <p className="text-sm text-muted-foreground truncate">{user.profile.bio}</p>
            </div>
        </CardContent>
    </Card>
);

const SearchSkeleton = ({ query }) => (
    <div>
        <h1 className="text-3xl font-bold mb-6">Searching for "{query}"...</h1>
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-8 w-40" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
            <div className="space-y-6">
                <Skeleton className="h-8 w-32" />
                <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </div>
        </div>
    </div>
);

export default SearchResultsPage;