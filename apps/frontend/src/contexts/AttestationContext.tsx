// apps/frontend/src/contexts/AttestationContext.tsx

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Tipos para os dados do nosso formulário
type Patient = { id: string; name: string; cpf: string; userId: string; };
type Cid = { id: string; code: string; description: string; };

type AttestationData = {
  patient: Patient | null;
  cid: Cid | null;
  purpose: string;
  durationInDays: number | '';
};

// Tipo para o valor do nosso contexto
type AttestationContextType = {
  data: AttestationData;
  setData: (data: AttestationData) => void;
  clearData: () => void;
};

// Valor inicial do nosso estado
const initialState: AttestationData = {
  patient: null,
  cid: null,
  purpose: '',
  durationInDays: 1,
};

// Criamos o contexto com um valor padrão
const AttestationContext = createContext<AttestationContextType | undefined>(undefined);

// Este é o nosso Provedor, o componente que vai "segurar" o estado
export function AttestationProvider({ children }: { children: ReactNode }) {
  const [attestationData, setAttestationData] = useState<AttestationData>(initialState);

  const setData = (newData: AttestationData) => {
    setAttestationData(newData);
  };

  const clearData = () => {
    setAttestationData(initialState);
  }

  return (
    <AttestationContext.Provider value={{ data: attestationData, setData, clearData }}>
      {children}
    </AttestationContext.Provider>
  );
}

// Este é um hook customizado para facilitar o uso do contexto nos componentes
export function useAttestation() {
  const context = useContext(AttestationContext);
  if (context === undefined) {
    throw new Error('useAttestation must be used within a AttestationProvider');
  }
  return context;
}