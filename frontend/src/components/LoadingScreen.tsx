import React, { useEffect, useState } from 'react';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-orange-500/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Diagonal orange lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 -left-1/4 w-[150%] h-0.5 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent transform rotate-12 animate-pulse"></div>
          <div className="absolute top-1/2 -left-1/4 w-[150%] h-0.5 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent transform rotate-12 animate-pulse delay-300"></div>
          <div className="absolute top-3/4 -left-1/4 w-[150%] h-0.5 bg-gradient-to-r from-transparent via-orange-500/40 to-transparent transform rotate-12 animate-pulse delay-700"></div>
        </div>
      </div>

      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="mb-8 animate-bounce-slow">
          <img 
            src="/ChatGPT Image Jul 4, 2025, 01_04_21 PM.png" 
            alt="JHADEPILOT" 
            className="w-32 h-32 mx-auto mb-4 drop-shadow-2xl animate-glow"
          />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-orange-200 bg-clip-text text-transparent animate-shimmer">
            JHADEPILOT
          </h1>
          <p className="text-gray-400 mt-2 animate-fade-in-up">AI-Powered Code Generation Platform</p>
        </div>

        {/* Loading bar */}
        <div className="w-80 mx-auto">
          <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full transition-all duration-300 ease-out animate-pulse"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-gray-400 mt-4 text-sm">
            Initializing AI Systems... {progress}%
          </p>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;