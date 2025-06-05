import React from 'react';
import { BookOpen, Github, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <BookOpen className="mr-2" />
            <h2 className="text-xl font-serif font-bold">BookMood</h2>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0 items-center">
            <a href="#" className="hover:text-amber-300 transition-colors">About</a>
            <a href="#" className="hover:text-amber-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-amber-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-amber-300 transition-colors">Contact</a>
          </div>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-amber-300 transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="hover:text-amber-300 transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>
        
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>© 2025 BookMood. All rights reserved.</p>
          <p className="mt-1">Find your perfect read based on your personality and mood.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;