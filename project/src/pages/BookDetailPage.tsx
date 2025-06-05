import React, { useState, useEffect } from 'react';
import { Heart, Share2, BookOpen, Star, ArrowLeft, BookOpenCheck, Download } from 'lucide-react';
import { bookApi, recommendationApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface BookDetailPageProps {
  bookId: number | null;
  navigateTo: (page: string, bookId?: number) => void;
}

const BookDetailPage: React.FC<BookDetailPageProps> = ({ bookId, navigateTo }) => {
  const [book, setBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) {
        navigateTo('search');
        return;
      }
      
      try {
        const response = await bookApi.getBookById(bookId);
        setBook(response.data);
        
        // Record view interaction if authenticated
        if (isAuthenticated) {
          recommendationApi.recordInteraction(bookId, 'view');
        }
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBook();
  }, [bookId, navigateTo, isAuthenticated]);

  const handleMarkAsRead = () => {
    if (isAuthenticated && bookId) {
      recommendationApi.recordInteraction(bookId, 'read');
      alert('Book marked as read!');
    } else {
      alert('Please log in to mark books as read');
    }
  };

  const handleSaveToLibrary = () => {
    if (isAuthenticated && bookId) {
      recommendationApi.recordInteraction(bookId, 'save');
      alert('Book saved to your library!');
    } else {
      alert('Please log in to save books to your library');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 h-96 bg-gray-200 rounded-lg"></div>
            <div className="w-full md:w-2/3">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-3 w-1/3"></div>
              <div className="flex gap-2 mb-6">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-6 w-3/4"></div>
              <div className="flex gap-2">
                <div className="h-10 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
          <BookOpen className="text-amber-700" size={32} />
        </div>
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Book Not Found</h2>
        <p className="text-gray-600 mb-6">
          We couldn't find the book you're looking for.
        </p>
        <button 
          onClick={() => navigateTo('search')}
          className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
        >
          Back to Search
        </button>
      </div>
    );
  }

  // Default cover image if none provided
  const defaultCover = "https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  return (
    <div className="max-w-5xl mx-auto">
      <button 
        onClick={() => navigateTo('search')}
        className="flex items-center text-amber-700 hover:text-amber-900 mb-8"
      >
        <ArrowLeft size={16} className="mr-1" /> Back to Search
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 bg-gray-100">
            <div className="p-6 h-full flex items-center justify-center">
              <img 
                src={book.cover_image || defaultCover} 
                alt={`Cover of ${book.title}`}
                className="w-full max-w-xs shadow-lg rounded-md"
              />
            </div>
          </div>
          
          <div className="w-full md:w-2/3 p-6 md:p-8">
            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">{book.title}</h1>
            <p className="text-gray-600 mb-4">by {book.author_name}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {book.genres_list.map((genre: string, index: number) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
            
            <div className="flex items-center mb-6">
              <div className="flex text-amber-500 mr-3">
                <Star size={18} className="fill-current" />
                <Star size={18} className="fill-current" />
                <Star size={18} className="fill-current" />
                <Star size={18} className="fill-current" />
                <Star size={18} />
              </div>
              <span className="text-gray-600 text-sm">4.0 rating</span>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Description</h2>
              <p className="text-gray-700">{book.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={handleMarkAsRead}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center"
              >
                <BookOpenCheck size={18} className="mr-1" /> Mark as Read
              </button>
              <button 
                onClick={handleSaveToLibrary}
                className="bg-white border border-amber-600 text-amber-600 px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors flex items-center"
              >
                <Heart size={18} className="mr-1" /> Save to Library
              </button>
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <Share2 size={18} className="mr-1" /> Share
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex flex-wrap -mb-px">
          <button
            className={`inline-block py-4 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`inline-block py-4 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
        </div>
      </div>
      
      {/* Tab content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {activeTab === 'overview' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Book Overview</h2>
              <p className="text-gray-700 mb-4">
                {book.description}
              </p>
              <p className="text-gray-700">
                Published on {new Date(book.published_date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Themes</h2>
              <div className="flex flex-wrap gap-2">
                {book.themes.split(',').map((theme: string, index: number) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {theme.trim()}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">This Book is Perfect For:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-bold text-amber-800 mb-2">Mood Match</h3>
                  <p className="text-gray-700">
                    {book.suitable_moods.charAt(0).toUpperCase() + book.suitable_moods.slice(1)} moods
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-bold text-amber-800 mb-2">Personality Match</h3>
                  <p className="text-gray-700">
                    {book.personality_match.charAt(0).toUpperCase() + book.personality_match.slice(1)} readers
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'details' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Book Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <h3 className="font-bold text-gray-700 mb-1">Title</h3>
                  <p className="text-gray-600">{book.title}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-bold text-gray-700 mb-1">Author</h3>
                  <p className="text-gray-600">{book.author_name}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-bold text-gray-700 mb-1">Genres</h3>
                  <p className="text-gray-600">{book.genres_list.join(', ')}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-bold text-gray-700 mb-1">Published Date</h3>
                  <p className="text-gray-600">
                    {new Date(book.published_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <h3 className="font-bold text-gray-700 mb-1">Page Count</h3>
                  <p className="text-gray-600">{book.page_count} pages</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-bold text-gray-700 mb-1">Language</h3>
                  <p className="text-gray-600">{book.language || 'English'}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-bold text-gray-700 mb-1">ISBN</h3>
                  <p className="text-gray-600">{book.isbn || 'Not available'}</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-700 mb-1">Reading Complexity</h3>
                  <p className="text-gray-600">
                    {book.complexity.charAt(0).toUpperCase() + book.complexity.slice(1)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="text-amber-700 hover:text-amber-900 flex items-center">
                <Download size={16} className="mr-1" /> Download Sample Chapter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;