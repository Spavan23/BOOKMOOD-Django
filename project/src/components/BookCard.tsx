import React from 'react';
import { BookOpen, Star, Heart } from 'lucide-react';

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  coverImage?: string;
  genres: string[];
  description: string;
  onClick: () => void;
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  author,
  coverImage,
  genres,
  description,
  onClick,
}) => {
  // Default cover image if none provided
  const defaultCover = "https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col"
    >
      <div className="relative pb-[140%] overflow-hidden">
        <img 
          src={coverImage || defaultCover} 
          alt={`Cover of ${title}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <button className="text-white bg-amber-600 hover:bg-amber-700 p-2 rounded-full mr-2">
            <Heart size={16} />
          </button>
          <button className="text-white bg-amber-600 hover:bg-amber-700 p-2 rounded-full">
            <BookOpen size={16} />
          </button>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-serif font-bold mb-1 line-clamp-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-2">by {author}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {genres.slice(0, 2).map((genre, index) => (
            <span 
              key={index} 
              className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>
        
        <p className="text-gray-700 text-sm line-clamp-3 mb-4 flex-grow">{description}</p>
        
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center">
            <Star className="text-amber-500 mr-1" size={16} />
            <span className="text-sm text-gray-700">4.5</span>
          </div>
          <button 
            className="text-amber-700 hover:text-amber-900 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;