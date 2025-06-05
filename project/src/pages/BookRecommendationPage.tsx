import React, { useState, useEffect } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';
import MoodSelector from '../components/MoodSelector';
import PersonalityQuiz from '../components/PersonalityQuiz';
import BookCard from '../components/BookCard';
import { recommendationApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface BookRecommendationPageProps {
  navigateTo: (page: string, bookId?: number) => void;
}

const BookRecommendationPage: React.FC<BookRecommendationPageProps> = ({ navigateTo }) => {
  const [step, setStep] = useState<'intro' | 'personality' | 'mood' | 'results'>('intro');
  const [personality, setPersonality] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const handlePersonalityComplete = (trait: string) => {
    setPersonality(trait);
    setStep('mood');
  };

  const handleMoodSelect = async (selectedMood: string) => {
    setMood(selectedMood);
    await getRecommendations(selectedMood);
  };

  const getRecommendations = async (selectedMood: string) => {
    setLoading(true);
    try {
      const response = await recommendationApi.getRecommendations(selectedMood, personality || undefined);
      setRecommendations(response.data);
      setStep('results');
    } catch (error) {
      console.error('Error getting recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetRecommendations = () => {
    setStep('mood');
    setMood(null);
    setRecommendations([]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {step === 'intro' && (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-6">Find Your Perfect Book Match</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Let us help you discover books that perfectly match your personality and current mood. 
            We'll ask a few questions to understand you better.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
            <div className="bg-amber-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-amber-800 mb-3">About You</h3>
              <p className="text-gray-700">
                We'll ask a few questions to understand your reading personality and preferences.
              </p>
            </div>
            
            <div className="bg-amber-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-amber-800 mb-3">Your Current Mood</h3>
              <p className="text-gray-700">
                Tell us how you're feeling right now to find books that match your emotional state.
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setStep('personality')}
            className="bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
          >
            Let's Get Started
          </button>
          
          {!isAuthenticated && (
            <p className="mt-6 text-gray-500 text-sm">
              Consider <button 
                className="text-amber-700 underline" 
                onClick={() => navigateTo('login')}
              >
                logging in
              </button> to save your preferences and recommendations.
            </p>
          )}
        </div>
      )}

      {step === 'personality' && (
        <>
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-6 text-center">Discover Your Reading Personality</h1>
          <PersonalityQuiz onComplete={handlePersonalityComplete} />
        </>
      )}

      {step === 'mood' && (
        <>
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-6 text-center">How Are You Feeling Today?</h1>
          <MoodSelector onMoodSelect={handleMoodSelect} />
        </>
      )}

      {step === 'results' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-serif font-bold text-gray-800">Your Book Recommendations</h1>
            <button 
              onClick={resetRecommendations}
              className="flex items-center text-amber-700 hover:text-amber-900"
            >
              <RefreshCw size={16} className="mr-1" /> Change Mood
            </button>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg mb-8">
            <p className="text-gray-700">
              Based on your {mood} mood
              {personality ? ` and ${personality} personality` : ''}, 
              we've found these books that might resonate with you right now.
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <>
              {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="flex flex-col h-full">
                      <div className="bg-white rounded-t-lg px-4 py-3 border-b border-amber-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-amber-700 font-bold">{rec.score}%</span>
                            <span className="ml-2 text-gray-600 text-sm">match</span>
                          </div>
                          <div className="flex">
                            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                              {rec.book_details.suitable_moods}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow">
                        <BookCard
                          id={rec.book_details.id}
                          title={rec.book_details.title}
                          author={rec.book_details.author_name}
                          genres={rec.book_details.genres_list}
                          description={rec.book_details.description}
                          onClick={() => navigateTo('book-detail', rec.book_details.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="text-amber-700" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No books found</h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any books matching your current preferences.
                    Try selecting a different mood or personality trait.
                  </p>
                  <button 
                    onClick={resetRecommendations}
                    className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BookRecommendationPage;