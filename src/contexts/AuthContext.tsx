import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  followers: string[];
  following: string[];
  createdAt: string;
  location?: string;
  website?: string;
  isVerified?: boolean;
  isAdmin?: boolean;
}

interface Post {
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

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  posts: Post[];
  allUsers: User[];
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  createPost: (content: string, image?: File) => Promise<void>;
  searchUsers: (query: string) => User[];
  getUserSuggestions: () => User[];
  updateProfilePicture: (file: File) => Promise<void>;
  getUserByUsername: (username: string) => User | null;
  verifyUser: (userId: string) => Promise<void>;
  unverifyUser: (userId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  editPost: (postId: string, content: string) => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const loadFromStorage = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const saveToStorage = (key: string, data: unknown) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const defaultAdmin: User = {
  id: 'admin-1',
  username: 'admin',
  email: 'admin@dukehub.com',
  password: 'admin123',
  avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=admin',
  bio: 'Platform Administrator',
  followers: [],
  following: [],
  createdAt: new Date().toISOString(),
  isVerified: true,
  isAdmin: true
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(loadFromStorage('currentUser'));
  const [posts, setPosts] = useState<Post[]>(loadFromStorage('posts') || []);
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const storedUsers = loadFromStorage('users') || [];
    return storedUsers.some((u: User) => u.email === defaultAdmin.email)
      ? storedUsers
      : [defaultAdmin, ...storedUsers];
  });

  useEffect(() => {
    if (user) {
      saveToStorage('currentUser', user);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('currentUser');
      setIsAuthenticated(false);
    }
  }, [user]);

  useEffect(() => {
    saveToStorage('posts', posts);
  }, [posts]);

  useEffect(() => {
    saveToStorage('users', allUsers);
  }, [allUsers]);

  const login = async (email: string, password: string) => {
    const foundUser = allUsers.find((u) => u.email === email && u.password === password);
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }
    setUser(foundUser);
    setIsAuthenticated(true);
  };

  const register = async (email: string, password: string, username: string) => {
    if (allUsers.some((u) => u.email === email)) {
      throw new Error('Email already exists');
    }
    if (allUsers.some((u) => u.username === username)) {
      throw new Error('Username already taken');
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      password,
      followers: [],
      following: [],
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${username}`,
      isVerified: false,
      isAdmin: false
    };

    setAllUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    setAllUsers((prev) =>
      prev.map((u) => (u.id === user.id ? updatedUser : u))
    );
  };

  const followUser = async (userId: string) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      following: [...user.following, userId]
    };
    setUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => {
      if (u.id === user.id) return updatedUser;
      if (u.id === userId) return { ...u, followers: [...u.followers, user.id] };
      return u;
    }));
  };

  const unfollowUser = async (userId: string) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      following: user.following.filter((id) => id !== userId)
    };
    setUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => {
      if (u.id === user.id) return updatedUser;
      if (u.id === userId) return { ...u, followers: u.followers.filter((id) => id !== user.id) };
      return u;
    }));
  };

  const createPost = async (content: string, image?: File) => {
    if (!user) return;
    const newPost: Post = {
      id: Date.now().toString(),
      content,
      image: image ? URL.createObjectURL(image) : undefined,
      author: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        isVerified: user.isVerified
      },
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString()
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const searchUsers = (query: string): User[] => {
    return allUsers.filter((u) =>
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getUserSuggestions = (): User[] => {
    if (!user) return [];
    return allUsers
      .filter((u) => u.id !== user.id && !user.following.includes(u.id))
      .slice(0, 5);
  };

  const updateProfilePicture = async (file: File) => {
    if (!user) return;
    const imageUrl = URL.createObjectURL(file);
    const updatedUser = { ...user, avatar: imageUrl };
    setUser(updatedUser);
    setAllUsers((prev) =>
      prev.map((u) => (u.id === user.id ? updatedUser : u))
    );
  };

  const getUserByUsername = (username: string): User | null => {
    return allUsers.find((u) => u.username === username) || null;
  };

  const verifyUser = async (userId: string) => {
    if (!isAdmin()) throw new Error('Unauthorized');
    setAllUsers((prev) =>
      prev.map((u) => u.id === userId ? { ...u, isVerified: true } : u)
    );
  };

  const unverifyUser = async (userId: string) => {
    if (!isAdmin()) throw new Error('Unauthorized');
    setAllUsers((prev) =>
      prev.map((u) => u.id === userId ? { ...u, isVerified: false } : u)
    );
  };

  const deletePost = async (postId: string) => {
    if (!isAdmin()) throw new Error('Unauthorized');
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const editPost = async (postId: string, content: string) => {
    if (!isAdmin()) throw new Error('Unauthorized');
    setPosts((prev) =>
      prev.map((p) => p.id === postId ? { ...p, content } : p)
    );
  };

  const isAdmin = (): boolean => {
    return user?.isAdmin || false;
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    posts,
    allUsers,
    login,
    register,
    logout,
    updateProfile,
    followUser,
    unfollowUser,
    createPost,
    searchUsers,
    getUserSuggestions,
    updateProfilePicture,
    getUserByUsername,
    verifyUser,
    unverifyUser,
    deletePost,
    editPost,
    isAdmin
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};