import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadAnalyses, saveAnalyses } from './accidentAnalysisStorage';

const AccidentAnalysisContext = createContext(null);

export function AAProvider({ children }) {
  const [analyses, setAnalyses] = useState(() => loadAnalyses());

  useEffect(() => {
    saveAnalyses(analyses);
  }, [analyses]);

  const generateCaseNumber = useCallback(() => {
    const year = new Date().getFullYear();
    const existing = analyses.filter(a => a.caseNumber?.startsWith(`KA-${year}`));
    const nextNum = existing.length + 1;
    return `KA-${year}-${String(nextNum).padStart(4, '0')}`;
  }, [analyses]);

  const addAnalysis = useCallback((analysisData) => {
    const newAnalysis = {
      id: Date.now().toString(),
      caseNumber: generateCaseNumber(),
      createdAt: new Date().toISOString(),
      status: 'completed',
      ...analysisData,
    };
    setAnalyses(prev => [newAnalysis, ...prev]);
    return newAnalysis;
  }, [generateCaseNumber]);

  const removeAnalysis = useCallback((id) => {
    setAnalyses(prev => prev.filter(a => a.id !== id));
  }, []);

  const updateAnalysis = useCallback((id, updates) => {
    setAnalyses(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, []);

  const value = {
    analyses,
    addAnalysis,
    removeAnalysis,
    updateAnalysis,
  };

  return (
    <AccidentAnalysisContext.Provider value={value}>
      {children}
    </AccidentAnalysisContext.Provider>
  );
}

export function useAA() {
  const ctx = useContext(AccidentAnalysisContext);
  if (!ctx) throw new Error('useAA must be used within AAProvider');
  return ctx;
}
