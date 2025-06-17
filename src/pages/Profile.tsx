import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Camera, MapPin, Link as LinkIcon, Calendar } from 'lucide-react';
import Post from '../components/post/Post';

const Profile: React.FC = () => {
  const { username } = useParams();
  const { user: currentUser, getUserByUsername, posts, followUser, unfollowUser, updateProfilePicture, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');

  const profileUser = getUserByUsername(username || '');
  const userPosts = posts.filter(post => post.author.id === profileUser?.id);
  const isOwnProfile = currentUser?.id === profileUser?.id;
  const isFollowing = currentUser?.following.includes(profileUser?.id || '');

  if (!profileUser) {
    return <Navigate to="/404" replace />;
  }

  const handleFollow = () => {
    if (isFollowing) {
      unfollowUser(profileUser.id);
    } else {
      followUser(profileUser.id);
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateProfilePicture(file);
    }
  };

  const handleUpdateProfile = () => {
    updateProfile({ bio, location, website });
    setIsEditing(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {/* Cover Photo */}
        <div className="h-48 bg-gray-700"></div>
        
        {/* Profile Info */}
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="relative -mt-20">
              <img
                src={profileUser.avatar}
                alt={profileUser.username}
                className="w-32 h-32 rounded-full border-4 border-gray-800"
              />
              {isOwnProfile && (
                <label className="absolute bottom-0 right-0 bg-gray-900 p-2 rounded-full cursor-pointer">
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="mt-4">
              {isOwnProfile ? (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700"
                >
                  {isEditing ? 'Save Profile' : 'Edit Profile'}
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-full ${
                    isFollowing
                      ? 'bg-gray-600 hover:bg-gray-700'
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h1 className="text-2xl font-bold">{profileUser.username}</h1>
            {isEditing ? (
              <div className="space-y-4 mt-4">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Add your bio"
                  className="w-full bg-gray-700 rounded-lg p-2"
                  rows={3}
                />
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    className="flex-1 bg-gray-700 rounded-lg p-2"
                  />
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Website"
                    className="flex-1 bg-gray-700 rounded-lg p-2"
                  />
                </div>
                <button
                  onClick={handleUpdateProfile}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <>
                {profileUser.bio && (
                  <p className="text-gray-300 mt-2">{profileUser.bio}</p>
                )}
                <div className="flex items-center space-x-4 mt-4 text-gray-400">
                  {profileUser.location && (
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      {profileUser.location}
                    </div>
                  )}
                  {profileUser.website && (
                    <div className="flex items-center">
                      <LinkIcon size={16} className="mr-1" />
                      <a
                        href={profileUser.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-500 hover:underline"
                      >
                        {profileUser.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    Joined {formatDate(profileUser.createdAt)}
                  </div>
                </div>
              </>
            )}

            <div className="flex space-x-6 mt-4">
              <div>
                <span className="font-bold">{profileUser.following.length}</span>
                <span className="text-gray-400 ml-1">Following</span>
              </div>
              <div>
                <span className="font-bold">{profileUser.followers.length}</span>
                <span className="text-gray-400 ml-1">Followers</span>
              </div>
              <div>
                <span className="font-bold">{userPosts.length}</span>
                <span className="text-gray-400 ml-1">Posts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div className="mt-6 space-y-6">
        {userPosts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};

export default Profile;