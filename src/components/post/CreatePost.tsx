import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const CreatePost: React.FC = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { user, createPost } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() || image) {
      await createPost(content, image || undefined);
      setContent('');
      setImage(null);
      setPreview(null);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 bg-gray-700 rounded-lg text-white resize-none"
          rows={3}
        />
        <div className="flex items-center space-x-4">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <span className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600">
              Add Photo
            </span>
          </label>
          <button
            type="submit"
            className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700"
            disabled={!content.trim() && !image}
          >
            Post
          </button>
        </div>
        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-60 rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setPreview(null);
              }}
              className="absolute top-2 right-2 bg-gray-900 text-white p-1 rounded-full hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreatePost;