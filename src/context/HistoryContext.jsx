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
    // Load from localStorage on initialization
    const saved = localStorage.getItem('analysisHistory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem('analysisHistory', JSON.stringify(history));
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

