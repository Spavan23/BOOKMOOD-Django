import React, { useState } from 'react';
import { Menu, X, BookOpen, User, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  navigateTo: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ navigateTo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (page: string) => {
    navigateTo(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-amber-600 to-amber-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation('home')}
          >
            <BookOpen className="mr-2" />
            <h1 className="text-2xl font-serif font-bold">BookMood</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => handleNavigation('home')}
              className="hover:text-amber-200 transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigation('recommendations')}
              className="hover:text-amber-200 transition-colors"
            >
              Recommendations
            </button>
            <button 
              onClick={() => handleNavigation('search')}
              className="hover:text-amber-200 transition-colors"
            >
              Explore
            </button>
            
            {isAuthenticated ? (
              <>
                <button 
                  onClick={() => handleNavigation('profile')}
                  className="hover:text-amber-200 transition-colors flex items-center"
                >
                  <User className="mr-1" size={18} />
                  Profile
                </button>
                <button 
                  onClick={() => {
                    logout();
                    handleNavigation('home');
                  }}
                  className="bg-white text-amber-700 px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => handleNavigation('login')}
                  className="hover:text-amber-200 transition-colors flex items-center"
                >
                  <LogIn className="mr-1" size={18} />
                  Login
                </button>
                <button 
                  onClick={() => handleNavigation('register')}
                  className="bg-white text-amber-700 px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-2 flex flex-col space-y-3">
            <button 
              onClick={() => handleNavigation('home')}
              className="text-left py-2 hover:text-amber-200 transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigation('recommendations')}
              className="text-left py-2 hover:text-amber-200 transition-colors"
            >
              Recommendations
            </button>
            <button 
              onClick={() => handleNavigation('search')}
              className="text-left py-2 hover:text-amber-200 transition-colors"
            >
              Explore
            </button>
            
            {isAuthenticated ? (
              <>
                <button 
                  onClick={() => handleNavigation('profile')}
                  className="text-left py-2 hover:text-amber-200 transition-colors"
                >
                  Profile
                </button>
                <button 
                  onClick={() => {
                    logout();
                    handleNavigation('home');
                  }}
                  className="text-left py-2 text-amber-200 font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => handleNavigation('login')}
                  className="text-left py-2 hover:text-amber-200 transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => handleNavigation('register')}
                  className="text-left py-2 text-amber-200 font-semibold"
                >
                  Sign Up
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;