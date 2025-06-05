import React, { useState } from 'react';
import { BookOpen, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  navigateTo: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ navigateTo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const success = await login(email, password);
      if (success) {
        navigateTo('home');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-center mb-8">
        <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center">
          <BookOpen className="text-amber-700" size={32} />
        </div>
      </div>
      
      <h1 className="text-3xl font-serif font-bold text-center text-gray-800 mb-6">Welcome Back</h1>
      <p className="text-center text-gray-600 mb-8">
        Sign in to get personalized book recommendations
      </p>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="text-gray-400" size={18} />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full pl-10 p-3"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="text-gray-400" size={18} />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full pl-10 p-3"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-amber-700 hover:text-amber-900">
              Forgot password?
            </a>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-amber-600 text-white font-medium rounded-lg text-sm px-5 py-3 text-center
              ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-amber-700'}`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => navigateTo('register')}
            className="text-amber-700 hover:text-amber-900 font-medium inline-flex items-center"
          >
            Sign up <ArrowRight className="ml-1" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;