import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { bookApi } from '../services/api';
import BookCard from '../components/BookCard';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  navigateTo: (page: string, bookId?: number) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
  const [featuredBooks, setFeaturedBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await bookApi.getBooks();
        // Get 3 random books for featured section
        const randomBooks = response.data.sort(() => 0.5 - Math.random()).slice(0, 3);
        setFeaturedBooks(randomBooks);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books:', error);
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero section */}
      <section className="relative bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-2xl overflow-hidden mb-12">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative p-8 md:p-12 z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">
            Find Your Perfect Book Match
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            Discover books that resonate with your personality and current mood. Let us guide you to your next favorite read.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigateTo('recommendations')}
              className="bg-white text-amber-800 px-6 py-3 rounded-lg font-medium hover:bg-amber-100 transition-colors flex items-center"
            >
              Get Recommendations <Sparkles className="ml-2" size={18} />
            </button>
            <button 
              onClick={() => navigateTo('search')}
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Browse All Books
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 w-1/3 h-full hidden lg:block">
          {/* Background decorative element */}
          <div className="absolute inset-0 bg-white/10 -skew-x-12 transform origin-bottom-right"></div>
        </div>
      </section>
      
      {/* Welcome back section for authenticated users */}
      {isAuthenticated && (
        <section className="bg-amber-50 rounded-xl p-6 mb-12">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-serif font-bold text-gray-800">Welcome back, {user?.username || 'Reader'}</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Continue exploring books matched to your personality and current mood.
          </p>
          <button 
            onClick={() => navigateTo('profile')}
            className="text-amber-700 font-medium hover:text-amber-900 flex items-center"
          >
            View your profile <ArrowRight className="ml-1" size={16} />
          </button>
        </section>
      )}
      
      {/* Featured books section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-800">Featured Books</h2>
          <button 
            onClick={() => navigateTo('search')}
            className="text-amber-700 font-medium hover:text-amber-900 flex items-center"
          >
            View all <ArrowRight className="ml-1" size={16} />
          </button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md h-96 animate-pulse">
                <div className="w-full h-56 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBooks.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author_name}
                genres={book.genres_list}
                description={book.description}
                onClick={() => navigateTo('book-detail', book.id)}
              />
            ))}
          </div>
        )}
      </section>
      
      {/* How it works section */}
      <section className="bg-white rounded-xl p-8 shadow-md mb-12">
        <h2 className="text-2xl font-serif font-bold text-gray-800 text-center mb-8">How BookMood Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-amber-700 font-bold text-xl">1</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Tell Us How You Feel</h3>
            <p className="text-gray-600">Share your current mood and answer a few questions about your personality.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-amber-700 font-bold text-xl">2</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Get Personalized Matches</h3>
            <p className="text-gray-600">Our algorithm finds books that resonate with your current state and preferences.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-amber-700 font-bold text-xl">3</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Discover New Favorites</h3>
            <p className="text-gray-600">Explore your recommendations and find your next perfect read.</p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigateTo('recommendations')}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors inline-flex items-center"
          >
            Start Your Journey <BookOpen className="ml-2" size={18} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;