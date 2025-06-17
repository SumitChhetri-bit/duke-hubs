import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Search } from 'lucide-react';
import type { User } from '../../types';

const UserSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const { searchUsers } = useAuth();

  useEffect(() => {
    if (query.trim()) {
      const results = searchUsers(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [query, searchUsers]);

  return (
    <div className="relative">
      <div className="flex items-center bg-gray-700 rounded-lg px-3">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full bg-transparent py-2 px-2 text-white focus:outline-none"
        />
      </div>
      {searchResults.length > 0 && (
        <div className="absolute w-full mt-2 bg-gray-800 rounded-lg shadow-lg z-50">
          {searchResults.map((user) => (
            <Link
              key={user.id}
              to={`/profile/${user.username}`}
              className="flex items-center p-3 hover:bg-gray-700"
            >
              <img
                src={user.avatar || 'https://via.placeholder.com/40'}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3">
                <p className="font-semibold text-white">{user.username}</p>
                {user.bio && (
                  <p className="text-sm text-gray-400">{user.bio}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
