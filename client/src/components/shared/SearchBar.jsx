import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${query.trim()}`);
            setQuery('');
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search projects and users..."
                className="pl-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </form>
    );
};

export default SearchBar;