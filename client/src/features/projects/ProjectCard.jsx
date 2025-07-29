import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare } from 'lucide-react';

export const ProjectCard = ({ project }) => {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>
                    <Link to={`/projects/${project._id}`} className="hover:underline">
                        {project.title}
                    </Link>
                </CardTitle>
                <CardDescription className="truncate">{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                {/* Could add a project thumbnail here */}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <Link to={`/users/${project.author._id}`} className="flex items-center gap-2 group">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={project.author.profile?.avatarUrl} alt={project.author.name} />
                        <AvatarFallback>{project.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground">{project.author.name}</span>
                </Link>
                <div className="flex items-center gap-1 text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm">{project.comments.length}</span>
                </div>
            </CardFooter>
        </Card>
    );
};