import React from 'react';

const Header = () => {
  return (
    <header className="border-b border-gray-800/50 backdrop-blur-sm bg-black/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-4">
              <img 
                src="/ChatGPT Image Jul 4, 2025, 01_04_21 PM.png" 
                alt="JHADEPILOT" 
                className="w-16 h-16 drop-shadow-lg animate-glow-subtle"
              />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-orange-200 bg-clip-text text-transparent">
                  JHADEPILOT
                </h1>
                <p className="text-sm text-gray-400">AI Code Generation Platform</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent tracking-wider">
                YOUR WORD OUR CODE
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;