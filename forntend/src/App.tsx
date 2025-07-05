import React, { useState, useEffect } from 'react';
import { Loader2, Send, Code, CheckCircle, XCircle, Clock, Sparkles } from 'lucide-react';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import CodeDisplay from './components/CodeDisplay';
import StatusPanel from './components/StatusPanel';
import PromptHistory from './components/PromptHistory';

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

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Simulate loading screen duration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedCode('');
    
    // Initialize agent statuses
    const initialStatuses: AgentStatus[] = [
      { agent: 'BuildAgent', status: 'pending' },
      { agent: 'TestAgent', status: 'pending' },
      { agent: 'DeployAgent', status: 'pending' }
    ];
    setAgentStatuses(initialStatuses);

    try {
      // Simulate API call with realistic timing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate code generation
      const mockCode = `# Generated Code for: "${prompt}"

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GeneratedComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/data');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Generated Component</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default GeneratedComponent;`;

      setGeneratedCode(mockCode);

      // Simulate agent progression
      const agents = ['BuildAgent', 'TestAgent', 'DeployAgent'];
      for (let i = 0; i < agents.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setAgentStatuses(prev => prev.map(status => 
          status.agent === agents[i] 
            ? { ...status, status: 'running' }
            : status
        ));

        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setAgentStatuses(prev => prev.map(status => 
          status.agent === agents[i] 
            ? { 
                ...status, 
                status: Math.random() > 0.2 ? 'success' : 'failed',
                message: Math.random() > 0.2 ? 'Completed successfully' : 'Process failed'
              }
            : status
        ));
      }

      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        prompt,
        timestamp: new Date(),
        code: mockCode,
        statuses: agentStatuses
      };
      
      setHistory(prev => [historyItem, ...prev.slice(0, 9)]);

    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setGeneratedCode(item.code);
    setAgentStatuses(item.statuses);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/3 to-orange-500/3 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              <PromptInput 
                prompt={prompt}
                setPrompt={setPrompt}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
              
              <CodeDisplay code={generatedCode} />
              
              <StatusPanel statuses={agentStatuses} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <PromptHistory 
                history={history}
                onLoadItem={loadHistoryItem}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;