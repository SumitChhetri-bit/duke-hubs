import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, CheckCircle } from 'lucide-react';

interface PostProps {
  id: string;
  content: string;
  image?: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    isVerified?: boolean;
  };
  likes: number;
  comments: Array<{
    id: string;
    content: string;
    author: {
      username: string;
      avatar?: string;
      isVerified?: boolean;
    };
  }>;
  createdAt: string;
}

const Post: React.FC<PostProps> = ({
  id,
  content,
  image,
  author,
  likes,
  comments,
  createdAt
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    setNewComment('');
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <Link to={`/profile/${author.username}`} className="flex items-center">
            <img
              src={author.avatar || 'https://via.placeholder.com/40'}
              alt={author.username}
              className="w-10 h-10 rounded-full"
            />
            <span className="ml-3 font-semibold flex items-center">
              {author.username}
              {author.isVerified && (
                <CheckCircle className="w-4 h-4 text-blue-500 ml-1" />
              )}
            </span>
          </Link>
          <span className="ml-auto text-gray-400 text-sm">{createdAt}</span>
        </div>
        <p className="text-white mb-4">{content}</p>
        {image && (
          <img src={image} alt="Post" className="rounded-lg w-full mb-4" />
        )}
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 ${
              isLiked ? 'text-red-500' : 'text-gray-400'
            } hover:text-red-500`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{likes + (isLiked ? 1 : 0)}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white"
          >
            <MessageCircle size={20} />
            <span>{comments.length}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-400 hover:text-white">
            <Share2 size={20} />
          </button>
        </div>
      </div>
      {showComments && (
        <div className="border-t border-gray-700 p-4">
          <form onSubmit={handleComment} className="mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 bg-gray-700 rounded-lg text-white"
            />
          </form>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <img
                  src={comment.author.avatar || 'https://via.placeholder.com/32'}
                  alt={comment.author.username}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center">
                    <Link
                      to={`/profile/${comment.author.username}`}
                      className="font-semibold hover:text-red-500"
                    >
                      {comment.author.username}
                    </Link>
                    {comment.author.isVerified && (
                      <CheckCircle className="w-4 h-4 text-blue-500 ml-1" />
                    )}
                  </div>
                  <p className="text-gray-300 mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;