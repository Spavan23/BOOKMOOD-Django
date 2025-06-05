import React, { useState, useEffect } from 'react';
import { BookOpen, User, Home, Search, BookOpenCheck, Sparkles } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BookRecommendationPage from './pages/BookRecommendationPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookDetailPage from './pages/BookDetailPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  
  // Handle navigation
  const navigateTo = (page: string, bookId: number | null = null) => {
    setCurrentPage(page);
    if (bookId) {
      setSelectedBookId(bookId);
    }
  };

  // Render the appropriate page based on the current route
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigateTo={navigateTo} />;
      case 'recommendations':
        return <BookRecommendationPage navigateTo={navigateTo} />;
      case 'profile':
        return <ProfilePage />;
      case 'search':
        return <SearchPage navigateTo={navigateTo} />;
      case 'login':
        return <LoginPage navigateTo={navigateTo} />;
      case 'register':
        return <RegisterPage navigateTo={navigateTo} />;
      case 'book-detail':
        return <BookDetailPage bookId={selectedBookId} navigateTo={navigateTo} />;
      default:
        return <HomePage navigateTo={navigateTo} />;
    }
  };

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-amber-50">
        <Header navigateTo={navigateTo} />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          {renderPage()}
        </main>
        
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4">
          <div className="flex justify-around items-center">
            <button 
              onClick={() => navigateTo('home')} 
              className={`p-2 rounded-full ${currentPage === 'home' ? 'text-amber-600 bg-amber-100' : 'text-gray-500'}`}
            >
              <Home size={24} />
            </button>
            <button 
              onClick={() => navigateTo('search')} 
              className={`p-2 rounded-full ${currentPage === 'search' ? 'text-amber-600 bg-amber-100' : 'text-gray-500'}`}
            >
              <Search size={24} />
            </button>
            <button 
              onClick={() => navigateTo('recommendations')} 
              className={`p-2 rounded-full ${currentPage === 'recommendations' ? 'text-amber-600 bg-amber-100' : 'text-gray-500'}`}
            >
              <Sparkles size={24} />
            </button>
            <button 
              onClick={() => navigateTo('profile')} 
              className={`p-2 rounded-full ${currentPage === 'profile' ? 'text-amber-600 bg-amber-100' : 'text-gray-500'}`}
            >
              <User size={24} />
            </button>
          </div>
        </nav>
        
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;