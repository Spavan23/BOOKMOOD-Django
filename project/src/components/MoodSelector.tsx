import React, { useState } from 'react';
import { Smile, Frown, Coffee, Zap, Sunset, Zap as Tense, Search, Lightbulb } from 'lucide-react';

interface MoodSelectorProps {
  onMoodSelect: (mood: string) => void;
}

const moods = [
  { id: 'happy', label: 'Happy', icon: Smile, color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
  { id: 'sad', label: 'Sad', icon: Frown, color: 'bg-blue-100 text-blue-600 border-blue-200' },
  { id: 'thoughtful', label: 'Thoughtful', icon: Coffee, color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
  { id: 'excited', label: 'Excited', icon: Zap, color: 'bg-pink-100 text-pink-600 border-pink-200' },
  { id: 'relaxed', label: 'Relaxed', icon: Sunset, color: 'bg-green-100 text-green-600 border-green-200' },
  { id: 'tense', label: 'Tense', icon: Tense, color: 'bg-red-100 text-red-600 border-red-200' },
  { id: 'curious', label: 'Curious', icon: Search, color: 'bg-purple-100 text-purple-600 border-purple-200' },
  { id: 'inspired', label: 'Inspired', icon: Lightbulb, color: 'bg-amber-100 text-amber-600 border-amber-200' },
];

const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodSelect }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number>(5);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    onMoodSelect(moodId);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6 text-center">How are you feeling today?</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {moods.map((mood) => {
          const Icon = mood.icon;
          return (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id)}
              className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center ${
                selectedMood === mood.id 
                  ? `${mood.color} border-current scale-105` 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Icon 
                size={32} 
                className={selectedMood === mood.id ? '' : 'text-gray-600'} 
              />
              <span className="mt-2 font-medium">{mood.label}</span>
            </button>
          );
        })}
      </div>
      
      {selectedMood && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How strongly do you feel this way? ({intensity})
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Slightly</span>
            <span>Moderately</span>
            <span>Intensely</span>
          </div>
        </div>
      )}
      
      <div className="mt-8 flex justify-center">
        <button
          disabled={!selectedMood}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedMood
              ? 'bg-amber-600 text-white hover:bg-amber-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          onClick={() => selectedMood && onMoodSelect(selectedMood)}
        >
          Find My Books
        </button>
      </div>
    </div>
  );
};

export default MoodSelector;