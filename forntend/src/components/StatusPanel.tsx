import React from 'react';
import { CheckCircle, XCircle, Clock, Loader2, Activity } from 'lucide-react';

interface AgentStatus {
  agent: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  message?: string;
}

interface StatusPanelProps {
  statuses: AgentStatus[];
}

const StatusPanel: React.FC<StatusPanelProps> = ({ statuses }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-gray-400';
      case 'running':
        return 'text-blue-400';
      case 'success':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-700/20';
      case 'running':
        return 'bg-blue-500/20 animate-pulse';
      case 'success':
        return 'bg-green-500/20';
      case 'failed':
        return 'bg-red-500/20';
      default:
        return 'bg-gray-700/20';
    }
  };

  if (statuses.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center space-x-3 mb-4">
        <Activity className="w-5 h-5 text-orange-400" />
        <h2 className="text-lg font-semibold text-white">Agent Status</h2>
      </div>
      
      <div className="space-y-3">
        {statuses.map((status, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border border-gray-700/30 transition-all duration-300 ${getStatusBg(status.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(status.status)}
                <span className="font-medium text-white">{status.agent}</span>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(status.status)}`}>
                {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
              </span>
            </div>
            {status.message && (
              <p className="text-sm text-gray-400 mt-2 ml-7">{status.message}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusPanel;