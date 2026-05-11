'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { PersonaId } from './types';

interface PersonaContextValue {
  activePersona: PersonaId;
  setActivePersona: (id: PersonaId) => void;
}

const PersonaContext = createContext<PersonaContextValue | null>(null);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [activePersona, setActivePersonaState] = useState<PersonaId>('aisyah');

  const setActivePersona = useCallback((id: PersonaId) => {
    setActivePersonaState(id);
  }, []);

  return (
    <PersonaContext.Provider value={{ activePersona, setActivePersona }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona(): PersonaContextValue {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error('usePersona must be used inside PersonaProvider');
  return ctx;
}
