import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, XCircle, Trash2, Edit2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { allUsers, posts, verifyUser, unverifyUser, deletePost, editPost, isAdmin } = useAuth();
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  if (!isAdmin()) {
    return <div className="text-center mt-8">Unauthorized Access</div>;
  }

  const handleEditPost = async (postId: string) => {
    if (editingPost === postId) {
      await editPost(postId, editContent);
      setEditingPost(null);
      setEditContent('');
    } else {
      const post = posts.find(p => p.id === postId);
      if (post) {
        setEditContent(post.content);
        setEditingPost(postId);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* User Management */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">User Management</h2>
        <div className="space-y-4">
          {allUsers.map(user => (
            <div key={user.id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold flex items-center">
                    {user.username}
                    {user.isVerified && (
                      <CheckCircle className="w-4 h-4 text-blue-500 ml-1" />
                    )}
                  </p>
                  <p className="text-sm text-gray-400">Followers: {user.followers.length}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {user.isVerified ? (
                  <button
                    onClick={() => unverifyUser(user.id)}
                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => verifyUser(user.id)}
                    className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Management */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Post Management</h2>
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={post.author.avatar}
                    alt={post.author.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-semibold">{post.author.username}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditPost(post.id)}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {editingPost === post.id ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-gray-600 text-white p-2 rounded mb-2"
                  rows={3}
                />
              ) : (
                <p className="text-gray-200">{post.content}</p>
              )}
              {post.image && (
                <img src={post.image} alt="Post" className="mt-2 rounded-lg max-h-48 object-cover" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;