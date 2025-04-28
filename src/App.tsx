import React, { useState, useEffect } from 'react';
import { MainDialog } from './components/MainDialog/MainDialog';
import { HistoryPanel } from './components/HistoryPanel/HistoryPanel';
import { CaptureModeSelector } from './components/CaptureModeSelector/CaptureModeSelector';
import { StorageService } from './services/storage';
import { DeepSeekService } from './services/deepseekApi';

const deepSeekApiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
const storage = new StorageService();
const deepSeek = new DeepSeekService(deepSeekApiKey);

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'solve' | 'history'>('solve');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    // Load config and history
    const loadData = async () => {
      
      
      const historyItems = await storage.getHistory();
      setHistory(historyItems);
    };
    
    loadData();
    
    // Listen for new results
    if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
      chrome.runtime.onMessage.addListener((message) => {
        if (message.type === 'NEW_RESULT') {
          setCurrentResult(message.data);
          setHistory(prev => [message.data, ...prev.slice(0, 9)]);
        }
      });
    }
  }, []);

  const handleApiKeySave = async (newKey: string) => {
    await storage.updateConfig({ apiKey: newKey });
    deepSeek.updateApiKey(newKey);
    setApiKey(newKey);
  };

  const handleCapture = (mode: 'visible' | 'selection') => {
    setIsProcessing(true);
  
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({
        type: mode === 'visible' ? 'CAPTURE_VISIBLE' : 'CAPTURE_SELECTION'
      });
    } else {
      console.warn('chrome.runtime.sendMessage is not available. Are you running outside a Chrome Extension context?');
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-container">
      <CaptureModeSelector 
        onCapture={handleCapture} 
        isProcessing={isProcessing}
      />
      
      <div className="tabs">
        <button 
          onClick={() => setActiveTab('solve')} 
          className={activeTab === 'solve' ? 'active' : ''}
        >
          Solution
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          className={activeTab === 'history' ? 'active' : ''}
        >
          History
        </button>
      </div>
      
      {activeTab === 'solve' ? (
        <MainDialog 
          result={currentResult} 
          isProcessing={isProcessing}
          apiKey={apiKey}
          onApiKeySave={handleApiKeySave}
        />
      ) : (
        <HistoryPanel 
          items={history}
          onSelectItem={(item) => setCurrentResult(item)}
        />
      )}
    </div>
  );
};