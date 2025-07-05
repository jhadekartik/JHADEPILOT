import React from 'react';
import { Code, Copy, Download } from 'lucide-react';

interface CodeDisplayProps {
  code: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-code.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!code) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-4">
          <Code className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Generated Code</h2>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-8 text-center">
          <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Your generated code will appear here...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Code className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Generated Code</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={copyToClipboard}
            className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors duration-200 text-gray-300 hover:text-white"
            title="Copy to clipboard"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={downloadCode}
            className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors duration-200 text-gray-300 hover:text-white"
            title="Download code"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="bg-gray-800/50 rounded-xl overflow-hidden">
        <pre className="p-6 text-sm text-gray-300 overflow-x-auto font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeDisplay;