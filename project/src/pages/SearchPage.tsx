import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import BookCard from '../components/BookCard';
import { bookApi } from '../services/api';

interface SearchPageProps {
  navigateTo: (page: string, bookId?: number) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ navigateTo }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    mood: '',
    complexity: '',
    personality: '',
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [booksResponse, genresResponse] = await Promise.all([
          bookApi.getBooks(),
          bookApi.getGenres(),
        ]);
        
        setBooks(booksResponse.data);
        setGenres(genresResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await bookApi.searchBooks(searchQuery);
      setBooks(response.data);
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreClick = async (genreId: number) => {
    if (selectedGenre === genreId) {
      // Deselect the genre and show all books
      setSelectedGenre(null);
      setLoading(true);
      try {
        const response = await bookApi.getBooks();
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Select the genre and filter books
      setSelectedGenre(genreId);
      setLoading(true);
      try {
        const response = await bookApi.getBooksByGenre(genreId);
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books by genre:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Apply filters to the current book list
  const filteredBooks = books.filter(book => {
    let match = true;
    
    if (filters.mood && book.suitable_moods !== filters.mood) {
      match = false;
    }
    
    if (filters.complexity && book.complexity !== filters.complexity) {
      match = false;
    }
    
    if (filters.personality && book.personality_match !== filters.personality) {
      match = false;
    }
    
    return match;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-6">Explore Books</h1>
        
        <form onSubmit={handleSearch} className="flex mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full pl-10 p-3"
              placeholder="Search by title, author, or keywords..."
            />
          </div>
          <button
            type="submit"
            className="ml-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="ml-2 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
          >
            <Filter size={18} className="mr-1" /> Filters
          </button>
        </form>
        
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
              <select
                name="mood"
                value={filters.mood}
                onChange={handleFilterChange}
                className="bg-white border border-gray-300 text-gray-700 rounded-md w-full py-2 px-3"
              >
                <option value="">Any Mood</option>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="thoughtful">Thoughtful</option>
                <option value="excited">Excited</option>
                <option value="relaxed">Relaxed</option>
                <option value="tense">Tense</option>
                <option value="curious">Curious</option>
                <option value="inspired">Inspired</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Complexity</label>
              <select
                name="complexity"
                value={filters.complexity}
                onChange={handleFilterChange}
                className="bg-white border border-gray-300 text-gray-700 rounded-md w-full py-2 px-3"
              >
                <option value="">Any Complexity</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="challenging">Challenging</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Personality Match</label>
              <select
                name="personality"
                value={filters.personality}
                onChange={handleFilterChange}
                className="bg-white border border-gray-300 text-gray-700 rounded-md w-full py-2 px-3"
              >
                <option value="">Any Personality</option>
                <option value="introvert">Introvert</option>
                <option value="extrovert">Extrovert</option>
                <option value="analytical">Analytical</option>
                <option value="creative">Creative</option>
                <option value="practical">Practical</option>
                <option value="adventurous">Adventurous</option>
              </select>
            </div>
          </div>
        )}
        
        {/* Genre filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreClick(genre.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedGenre === genre.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
        <>
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
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
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="text-amber-700" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No books found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any books matching your search criteria.
                Try adjusting your filters or search terms.
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGenre(null);
                  setFilters({ mood: '', complexity: '', personality: '' });
                  setShowFilters(false);
                  
                  // Reset to all books
                  setLoading(true);
                  bookApi.getBooks().then(response => {
                    setBooks(response.data);
                    setLoading(false);
                  }).catch(error => {
                    console.error('Error fetching books:', error);
                    setLoading(false);
                  });
                }}
                className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;