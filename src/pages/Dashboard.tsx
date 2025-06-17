import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import CreatePost from '../components/post/CreatePost';
import Post from '../components/post/Post';
import UserSearch from '../components/user/UserSearch';
import UserSuggestions from '../components/user/UserSuggestions';

const Dashboard: React.FC = () => {
  const { posts } = useAuth();

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <CreatePost />
        <div className="space-y-6">
          {posts.map((post) => (
            <Post key={post.id} {...post} />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <UserSearch />
        <UserSuggestions />
      </div>
    </div>
  );
};

export default Dashboard;