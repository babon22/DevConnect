import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Code, LogOut, PlusCircle, User as UserIcon } from 'lucide-react';
import SearchBar from './SearchBar';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <Code className="h-6 w-6" />
          <span className="font-bold">DevConnect</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SearchBar />
          </div>
          <nav className="flex items-center">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/projects/new" className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Create Project</span>
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to={`/users/${user._id}`} className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                     <span className="hidden sm:inline">Profile</span>
                  </Link>
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                   <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;