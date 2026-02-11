import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  loadBranches, saveBranches,
  loadProductions, saveProductions,
  loadTargets, saveTargets,
  loadSettings, saveSettings,
} from '../utils/storage';
import { DEFAULT_TARGETS } from '../utils/constants';
import { generateId } from '../utils/constants';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [branches, setBranches] = useState(() => loadBranches());
  const [productions, setProductions] = useState(() => loadProductions());
  const [targets, setTargets] = useState(() => loadTargets() || DEFAULT_TARGETS);
  const [settings, setSettings] = useState(() => loadSettings());

  useEffect(() => { saveBranches(branches); }, [branches]);
  useEffect(() => { saveProductions(productions); }, [productions]);
  useEffect(() => { saveTargets(targets); }, [targets]);
  useEffect(() => { saveSettings(settings); }, [settings]);

  const addBranch = useCallback((name) => {
    const newBranch = { id: generateId(), name, isMain: false };
    setBranches(prev => [...prev, newBranch]);
    return newBranch;
  }, []);

  const updateBranch = useCallback((id, name) => {
    setBranches(prev => prev.map(b => b.id === id ? { ...b, name } : b));
  }, []);

  const removeBranch = useCallback((id) => {
    setBranches(prev => prev.filter(b => b.id !== id || b.isMain));
    setProductions(prev => prev.filter(p => p.branchId !== id));
  }, []);

  const addProduction = useCallback((production) => {
    const newProd = {
      ...production,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setProductions(prev => [...prev, newProd]);
    return newProd;
  }, []);

  const updateProduction = useCallback((id, updates) => {
    setProductions(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const removeProduction = useCallback((id) => {
    setProductions(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateTargets = useCallback((newTargets) => {
    setTargets(newTargets);
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const value = {
    branches,
    productions,
    targets,
    settings,
    addBranch,
    updateBranch,
    removeBranch,
    addProduction,
    updateProduction,
    removeProduction,
    updateTargets,
    updateSettings,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
