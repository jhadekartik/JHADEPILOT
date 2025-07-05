import React from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  setPrompt,
  onGenerate,
  isGenerating
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center space-x-3 mb-4">
        <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />
        <h2 className="text-lg font-semibold text-white">Generate Code</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to build... (e.g., 'Build a chatbot using FastAPI')"
            className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
            disabled={isGenerating}
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-orange-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
        
        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className="w-full bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed group"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              <span>Generate Code</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PromptInput;