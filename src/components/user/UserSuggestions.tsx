import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const UserSuggestions: React.FC = () => {
  const { getUserSuggestions, followUser } = useAuth();
  const suggestions = getUserSuggestions();

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-xl font-semibold mb-4">Suggested Users</h3>
      <div className="space-y-4">
        {suggestions.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <Link
              to={`/profile/${user.username}`}
              className="flex items-center"
            >
              <img
                src={user.avatar || 'https://via.placeholder.com/40'}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3">
                <p className="font-semibold">{user.username}</p>
                {user.bio && (
                  <p className="text-sm text-gray-400">{user.bio}</p>
                )}
              </div>
            </Link>
            <button
              onClick={() => followUser(user.id)}
              className="bg-red-600 text-white px-4 py-1 rounded-full text-sm hover:bg-red-700"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSuggestions;