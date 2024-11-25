import React from 'react';
import { Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-2 bg-gray-800 text-white">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <span className="text-center mb-1">
          ⚡ Developed by Leo Gama
        </span>
        <div className="flex space-x-4">
          <a
            href="https://github.com/LeoGamaJ"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
            aria-label="GitHub Profile"
          >
            <Github size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/leonardo-gama-jardim/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
