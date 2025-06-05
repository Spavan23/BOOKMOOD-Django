// This is a mock API service that simulates calls to the Django backend
// In a real application, you would make actual HTTP requests to your API endpoints

// Mock book data
const mockBooks = [
  {
    id: 1,
    title: "The Silent Observer",
    author: "Elena Martins",
    author_name: "Elena Martins",
    description: "A thrilling mystery novel about a woman who witnesses a crime and must decide whether to come forward or protect her own secrets.",
    genres_list: ["Mystery", "Thriller"],
    suitable_moods: "tense",
    themes: "justice, morality, secrets",
    complexity: "medium",
    personality_match: "introvert",
    page_count: 342,
    published_date: "2023-05-15",
  },
  {
    id: 2,
    title: "Echoes of Tomorrow",
    author: "Javier Rodriguez",
    author_name: "Javier Rodriguez",
    description: "A science fiction epic set 200 years in the future where humanity has spread throughout the solar system but faces extinction from an unknown threat.",
    genres_list: ["Science Fiction", "Adventure"],
    suitable_moods: "thoughtful",
    themes: "survival, humanity, exploration",
    complexity: "challenging",
    personality_match: "analytical",
    page_count: 512,
    published_date: "2022-11-08",
  },
  {
    id: 3,
    title: "Sunflower Summer",
    author: "Grace Chen",
    author_name: "Grace Chen",
    description: "A heartwarming story about finding love and purpose in a small countryside town during one transformative summer.",
    genres_list: ["Romance", "Contemporary"],
    suitable_moods: "happy",
    themes: "love, growth, community",
    complexity: "easy",
    personality_match: "extrovert",
    page_count: 278,
    published_date: "2024-01-20",
  },
  {
    id: 4,
    title: "The Alchemist's Secret",
    author: "Marcus Webb",
    author_name: "Marcus Webb",
    description: "A historical fantasy following a young apprentice who discovers his master's mysterious connection to an ancient order of alchemists.",
    genres_list: ["Fantasy", "Historical Fiction"],
    suitable_moods: "curious",
    themes: "discovery, power, knowledge",
    complexity: "medium",
    personality_match: "creative",
    page_count: 386,
    published_date: "2021-09-12",
  },
  {
    id: 5,
    title: "Mindful Living",
    author: "Sarah Johnson",
    author_name: "Sarah Johnson",
    description: "A practical guide to incorporating mindfulness into everyday life for improved mental health and well-being.",
    genres_list: ["Self-help", "Psychology"],
    suitable_moods: "relaxed",
    themes: "mindfulness, health, balance",
    complexity: "medium",
    personality_match: "practical",
    page_count: 245,
    published_date: "2023-02-28",
  },
  {
    id: 6,
    title: "Beyond the Horizon",
    author: "Thomas Lee",
    author_name: "Thomas Lee",
    description: "An adventure novel about a solo sailing journey around the world that turns into an unexpected test of human endurance.",
    genres_list: ["Adventure", "Memoir"],
    suitable_moods: "inspired",
    themes: "challenge, perseverance, discovery",
    complexity: "medium",
    personality_match: "adventurous",
    page_count: 312,
    published_date: "2022-06-14",
  },
];

// Mock genres
const mockGenres = [
  { id: 1, name: "Mystery", description: "Fiction dealing with solving a crime or puzzle" },
  { id: 2, name: "Thriller", description: "Fiction with suspense, excitement, and high stakes" },
  { id: 3, name: "Science Fiction", description: "Fiction based on scientific discoveries and technology" },
  { id: 4, name: "Fantasy", description: "Fiction with supernatural elements" },
  { id: 5, name: "Romance", description: "Stories centered around romantic relationships" },
  { id: 6, name: "Contemporary", description: "Fiction set in the present time" },
  { id: 7, name: "Historical Fiction", description: "Fiction set in the past" },
  { id: 8, name: "Adventure", description: "Fiction focused on exciting journeys and challenges" },
  { id: 9, name: "Self-help", description: "Books focused on self-improvement" },
  { id: 10, name: "Psychology", description: "Books about human behavior and mind" },
  { id: 11, name: "Memoir", description: "Autobiographical works" },
];

// API services
export const bookApi = {
  // Get all books
  getBooks: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: mockBooks };
  },
  
  // Get a single book by ID
  getBookById: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const book = mockBooks.find(book => book.id === id);
    
    if (!book) {
      throw new Error('Book not found');
    }
    
    return { data: book };
  },
  
  // Search books
  searchBooks: async (query: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const filteredBooks = mockBooks.filter(
      book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author_name.toLowerCase().includes(query.toLowerCase()) ||
        book.description.toLowerCase().includes(query.toLowerCase()) ||
        book.genres_list.some(genre => genre.toLowerCase().includes(query.toLowerCase()))
    );
    
    return { data: filteredBooks };
  },
  
  // Get books by genre
  getBooksByGenre: async (genreId: number) => {
    await new Promise(resolve => setTimeout(resolve, 700));
    const genre = mockGenres.find(g => g.id === genreId);
    
    if (!genre) {
      throw new Error('Genre not found');
    }
    
    const filteredBooks = mockBooks.filter(
      book => book.genres_list.includes(genre.name)
    );
    
    return { data: filteredBooks };
  },
  
  // Get all genres
  getGenres: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { data: mockGenres };
  },
};

export const recommendationApi = {
  // Get book recommendations based on mood and personality
  getRecommendations: async (mood: string, personality?: string) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    let filteredBooks = [...mockBooks];
    
    // Filter by mood if provided
    if (mood) {
      filteredBooks = filteredBooks.filter(book => book.suitable_moods === mood);
    }
    
    // Further filter by personality if provided
    if (personality) {
      // If no books match both criteria, fall back to just mood
      const personalityMatches = filteredBooks.filter(book => book.personality_match === personality);
      
      if (personalityMatches.length > 0) {
        filteredBooks = personalityMatches;
      }
    }
    
    // If no matches, return a sample of books
    if (filteredBooks.length === 0) {
      filteredBooks = mockBooks.slice(0, 3);
    }
    
    // Add a recommendation score and reason
    const recommendations = filteredBooks.map(book => ({
      id: book.id,
      book: book.id,
      book_details: book,
      score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
      reason: `This book matches your ${mood} mood${personality ? ` and ${personality} personality` : ''}.`,
      current_mood: mood,
      is_read: false,
      created_at: new Date().toISOString(),
    }));
    
    // Sort by score
    recommendations.sort((a, b) => b.score - a.score);
    
    return { data: recommendations };
  },
  
  // Update user preferences
  updatePreferences: async (preferences: any) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
  },
  
  // Save user's current mood
  saveMood: async (mood: string, intensity: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },
  
  // Record book interaction (view, save, like, etc.)
  recordInteraction: async (bookId: number, interactionType: string, rating?: number) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { success: true };
  },
};

export const userApi = {
  // Get user profile
  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Mock user profile
    const profile = {
      id: 1,
      username: "bookuser",
      email: "user@example.com",
      avatar: null,
      bio: "Avid reader and book enthusiast",
      books_read: 27,
      currently_reading: 3,
      dominant_trait: "creative",
    };
    
    return { data: profile };
  },
  
  // Update user profile
  updateProfile: async (profileData: any) => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return { success: true, data: { ...profileData, id: 1 } };
  },
};