import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, LogOut, Shield } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user, isAdmin } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-red-500">
          Duke Hub
        </Link>
        <div className="space-x-4 flex items-center">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-white hover:text-red-500">
                Dashboard
              </Link>
              {isAdmin() && (
                <Link to="/admin" className="text-white hover:text-red-500 flex items-center">
                  <Shield className="w-5 h-5 mr-1" />
                  Admin
                </Link>
              )}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-white hover:text-red-500"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User size={24} />
                  )}
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-2 z-50">
                    <Link
                      to={`/profile/${user?.username}`}
                      className="flex items-center px-4 py-2 text-white hover:bg-gray-700"
                      onClick={() => setShowDropdown(false)}
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-white hover:bg-gray-700"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-red-500">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
              >
                Join Now
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;