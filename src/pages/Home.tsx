import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <h1 className="text-5xl font-bold">
          Welcome to <span className="text-red-500">Duke Hub</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Your premium platform for connecting with creators and accessing exclusive content.
          Join our growing community today.
        </p>
        <div className="space-x-4">
          <Link 
            to="/register" 
            className="btn-primary inline-block text-lg"
          >
            Get Started
          </Link>
          <Link 
            to="/login" 
            className="inline-block text-lg text-white hover:text-red-500"
          >
            Already a member?
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Premium Content</h3>
          <p className="text-gray-300">
            Access exclusive content from your favorite creators.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Direct Interaction</h3>
          <p className="text-gray-300">
            Connect directly with creators through live streams and chats.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Secure Platform</h3>
          <p className="text-gray-300">
            Your content and transactions are always protected.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-800 p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
        <p className="text-gray-300 mb-6">
          Join thousands of creators and fans on Duke Hub.
        </p>
        <Link 
          to="/register" 
          className="btn-primary inline-block text-lg"
        >
          Create Your Account
        </Link>
      </section>
    </div>
  );
};

export default Home;