import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  loadCases, saveCases,
  loadLawyers, saveLawyers,
  loadVLSettings, saveVLSettings,
} from './valueLossStorage';

const VLContext = createContext(null);

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function generateCaseNo(existingCases) {
  const year = new Date().getFullYear();
  const prefix = `DK-${year}-`;
  const existing = existingCases.filter(c => c.caseNo?.startsWith(prefix));
  const num = existing.length + 1;
  return `${prefix}${String(num).padStart(4, '0')}`;
}

export function VLProvider({ children }) {
  const [cases, setCases] = useState(() => loadCases());
  const [lawyers, setLawyers] = useState(() => loadLawyers());
  const [vlSettings, setVLSettings] = useState(() => loadVLSettings());

  useEffect(() => { saveCases(cases); }, [cases]);
  useEffect(() => { saveLawyers(lawyers); }, [lawyers]);
  useEffect(() => { saveVLSettings(vlSettings); }, [vlSettings]);

  const addCase = useCallback((caseData) => {
    const newCase = {
      ...caseData,
      id: generateId(),
      caseNo: generateCaseNo(cases),
      status: 'open',
      stageHistory: [{ stage: 'open', date: new Date().toISOString(), note: 'Dosya olusturuldu' }],
      settlement: null,
      expenses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCases(prev => [...prev, newCase]);
    return newCase;
  }, [cases]);

  const updateCase = useCallback((id, updates) => {
    setCases(prev => prev.map(c =>
      c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
    ));
  }, []);

  const removeCase = useCallback((id) => {
    setCases(prev => prev.filter(c => c.id !== id));
  }, []);

  const assignLawyer = useCallback((caseId, lawyerId) => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      return {
        ...c,
        lawyerId,
        assignedAt: new Date().toISOString(),
        status: 'assigned',
        stageHistory: [
          ...c.stageHistory,
          { stage: 'assigned', date: new Date().toISOString(), note: 'Avukata atandi' },
        ],
        updatedAt: new Date().toISOString(),
      };
    }));
  }, []);

  const advanceStage = useCallback((caseId, stage, note = '') => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      return {
        ...c,
        status: stage,
        stageHistory: [
          ...c.stageHistory,
          { stage, date: new Date().toISOString(), note },
        ],
        updatedAt: new Date().toISOString(),
      };
    }));
  }, []);

  const addExpense = useCallback((caseId, expense) => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      return {
        ...c,
        expenses: [...c.expenses, { ...expense, id: generateId(), date: new Date().toISOString() }],
        updatedAt: new Date().toISOString(),
      };
    }));
  }, []);

  const removeExpense = useCallback((caseId, expenseId) => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      return {
        ...c,
        expenses: c.expenses.filter(e => e.id !== expenseId),
        updatedAt: new Date().toISOString(),
      };
    }));
  }, []);

  const settleCase = useCallback((caseId, settlement) => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      return {
        ...c,
        settlement,
        status: 'closed',
        stageHistory: [
          ...c.stageHistory,
          { stage: 'closed', date: new Date().toISOString(), note: 'Dosya kapandi - hesaplama tamamlandi' },
        ],
        updatedAt: new Date().toISOString(),
      };
    }));
  }, []);

  const addLawyer = useCallback((lawyer) => {
    const newLawyer = { ...lawyer, id: generateId(), createdAt: new Date().toISOString() };
    setLawyers(prev => [...prev, newLawyer]);
    return newLawyer;
  }, []);

  const updateLawyer = useCallback((id, updates) => {
    setLawyers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  }, []);

  const removeLawyer = useCallback((id) => {
    setLawyers(prev => prev.filter(l => l.id !== id));
  }, []);

  const updateVLSettings = useCallback((updates) => {
    setVLSettings(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <VLContext.Provider value={{
      cases, lawyers, vlSettings,
      addCase, updateCase, removeCase,
      assignLawyer, advanceStage,
      addExpense, removeExpense, settleCase,
      addLawyer, updateLawyer, removeLawyer,
      updateVLSettings,
    }}>
      {children}
    </VLContext.Provider>
  );
}

export function useVL() {
  const ctx = useContext(VLContext);
  if (!ctx) throw new Error('useVL must be used within VLProvider');
  return ctx;
}
