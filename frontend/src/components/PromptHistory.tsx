import React from 'react';
import { History, Clock, Code } from 'lucide-react';

interface AgentStatus {
  agent: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  message?: string;
}

interface HistoryItem {
  id: string;
  prompt: string;
  timestamp: Date;
  code: string;
  statuses: AgentStatus[];
}

interface PromptHistoryProps {
  history: HistoryItem[];
  onLoadItem: (item: HistoryItem) => void;
}

const PromptHistory: React.FC<PromptHistoryProps> = ({ history, onLoadItem }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSuccessCount = (statuses: AgentStatus[]) => {
    return statuses.filter(s => s.status === 'success').length;
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center space-x-3 mb-4">
        <History className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-white">Recent Prompts</h2>
      </div>
      
      {history.length === 0 ? (
        <div className="text-center py-8">
          <History className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No prompts yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onLoadItem(item)}
              className="p-4 bg-gray-800/30 hover:bg-gray-700/30 rounded-xl cursor-pointer transition-all duration-200 border border-gray-700/20 hover:border-gray-600/30 group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-400">{formatTime(item.timestamp)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-gray-400">
                    {getSuccessCount(item.statuses)}/3
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-white group-hover:text-blue-200 transition-colors duration-200 line-clamp-2 mb-2">
                {item.prompt}
              </p>
              
              <div className="flex items-center space-x-2">
                <Code className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-500">
                  {item.code.split('\n').length} lines
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptHistory;