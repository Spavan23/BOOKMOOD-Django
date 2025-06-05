import React, { useState } from 'react';

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    trait: string;
  }[];
}

interface PersonalityQuizProps {
  onComplete: (trait: string) => void;
}

// Sample questions to determine personality traits
const questions: Question[] = [
  {
    id: 1,
    text: "How do you typically recharge after a long day?",
    options: [
      { text: "Spending time alone with a book or movie", trait: "introvert" },
      { text: "Going out with friends or to social events", trait: "extrovert" },
      { text: "Analyzing my day and planning for tomorrow", trait: "analytical" },
      { text: "Creating something or expressing myself artistically", trait: "creative" },
    ]
  },
  {
    id: 2,
    text: "When facing a problem, you usually:",
    options: [
      { text: "Follow a systematic approach to find a solution", trait: "analytical" },
      { text: "Come up with innovative, out-of-the-box solutions", trait: "creative" },
      { text: "Rely on proven methods that have worked before", trait: "practical" },
      { text: "Try different approaches, even if they're risky", trait: "adventurous" },
    ]
  },
  {
    id: 3,
    text: "On weekends, you prefer to:",
    options: [
      { text: "Stay home and enjoy your own space", trait: "introvert" },
      { text: "Participate in group activities or social gatherings", trait: "extrovert" },
      { text: "Engage in a practical hobby or home improvement", trait: "practical" },
      { text: "Try something new and exciting you've never done before", trait: "adventurous" },
    ]
  },
  {
    id: 4,
    text: "What type of movie would you most likely watch?",
    options: [
      { text: "Documentaries or films that make me think", trait: "analytical" },
      { text: "Artistic or experimental films", trait: "creative" },
      { text: "Action or adventure films with exciting plots", trait: "adventurous" },
      { text: "Practical how-to shows or films about real-life situations", trait: "practical" },
    ]
  },
  {
    id: 5,
    text: "In a group project, you tend to:",
    options: [
      { text: "Prefer working independently on your assigned part", trait: "introvert" },
      { text: "Facilitate discussions and coordinate between team members", trait: "extrovert" },
      { text: "Organize the workflow and ensure practicality", trait: "practical" },
      { text: "Suggest innovative approaches and creative solutions", trait: "creative" },
    ]
  }
];

const PersonalityQuiz: React.FC<PersonalityQuizProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAnswer = (trait: string) => {
    const newAnswers = [...answers, trait];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Determine dominant trait
      const traitCounts: Record<string, number> = {};
      newAnswers.forEach(trait => {
        traitCounts[trait] = (traitCounts[trait] || 0) + 1;
      });
      
      // Find the trait with the highest count
      let dominantTrait = Object.keys(traitCounts)[0];
      let maxCount = traitCounts[dominantTrait];
      
      Object.entries(traitCounts).forEach(([trait, count]) => {
        if (count > maxCount) {
          dominantTrait = trait;
          maxCount = count;
        }
      });
      
      setIsCompleted(true);
      onComplete(dominantTrait);
    }
  };

  // Map traits to friendly names
  const traitLabels: Record<string, string> = {
    'introvert': 'Introspective Reader',
    'extrovert': 'Social Reader',
    'analytical': 'Analytical Thinker',
    'creative': 'Creative Soul',
    'practical': 'Practical Mind',
    'adventurous': 'Adventure Seeker'
  };

  // Map traits to descriptions
  const traitDescriptions: Record<string, string> = {
    'introvert': 'You enjoy deep, thoughtful books that let you explore complex ideas in solitude.',
    'extrovert': 'You gravitate toward books with rich character interactions and social dynamics.',
    'analytical': 'You appreciate books with logical structures, detailed arguments, and intellectual depth.',
    'creative': 'You\'re drawn to imaginative stories with unique perspectives and artistic expression.',
    'practical': 'You prefer books with actionable insights and real-world applications.',
    'adventurous': 'You seek books that take you on exciting journeys and push boundaries.'
  };

  // Find dominant trait from answers
  const findDominantTrait = () => {
    const traitCounts: Record<string, number> = {};
    answers.forEach(trait => {
      traitCounts[trait] = (traitCounts[trait] || 0) + 1;
    });
    
    let dominantTrait = Object.keys(traitCounts)[0];
    let maxCount = traitCounts[dominantTrait];
    
    Object.entries(traitCounts).forEach(([trait, count]) => {
      if (count > maxCount) {
        dominantTrait = trait;
        maxCount = count;
      }
    });
    
    return dominantTrait;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
      {!isCompleted ? (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Discover Your Reading Personality</h2>
            <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-amber-600 h-2 rounded-full transition-all" 
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-medium text-gray-800 mb-4">{questions[currentQuestion].text}</h3>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-colors"
                  onClick={() => handleAnswer(option.trait)}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Your Reading Personality</h2>
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-xl font-bold text-amber-700">{traitLabels[findDominantTrait()]}</h3>
            <p className="text-gray-600 mt-2">{traitDescriptions[findDominantTrait()]}</p>
          </div>
          
          <button
            className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
            onClick={() => onComplete(findDominantTrait())}
          >
            Find Books For Me
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalityQuiz;