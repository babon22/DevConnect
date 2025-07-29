import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

const CommentList = ({ comments }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Feedback ({comments.length})</h3>
      {comments.length === 0 ? (
        <p className="text-muted-foreground">Be the first to leave a comment.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment._id} className="flex gap-4">
              <Link to={`/users/${comment.author._id}`}>
                <Avatar>
                  <AvatarImage src={comment.author.profile?.avatarUrl} alt={comment.author.name} />
                  <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <Link to={`/users/${comment.author._id}`} className="font-semibold hover:underline">
                    {comment.author.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-foreground/90">{comment.text}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentList;