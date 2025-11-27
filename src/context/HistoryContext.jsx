import { createContext, useContext, useState, useEffect } from 'react';

const HistoryContext = createContext();

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within HistoryProvider');
  }
  return context;
};

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState(() => {
    try {
      // Load from localStorage on initialization
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('analysisHistory');
        if (saved) {
          try {
            return JSON.parse(saved);
          } catch (e) {
            console.error('Error parsing history from localStorage:', e);
            return [];
          }
        }
      }
      return [];
    } catch (error) {
      console.error('Error initializing history:', error);
      return [];
    }
  });

  // Save to localStorage whenever history changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('analysisHistory', JSON.stringify(history));
      }
    } catch (error) {
      console.error('Error saving history to localStorage:', error);
    }
  }, [history]);

  const addToHistory = (result) => {
    setHistory(prev => [...prev, result]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const removeFromHistory = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory, removeFromHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

