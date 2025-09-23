'use client';

import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { Patient } from '@/contexts/AttestationContext';

export type PrescriptionItem = {
  id: string;
  title: string;
  description: string;
  observation: string;
};

export type PrescriptionFormData = {
  patient: Patient | null;
  items: PrescriptionItem[];
  generalGuidance: string;
  additionalNotes: string;
};

type PrescriptionContextValue = {
  data: PrescriptionFormData;
  setData: (data: PrescriptionFormData) => void;
  clearData: () => void;
};

const generateId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `item-${Math.random().toString(36).slice(2, 8)}`);

const createEmptyItem = (): PrescriptionItem => ({
  id: generateId(),
  title: '',
  description: '',
  observation: '',
});

const initialState: PrescriptionFormData = {
  patient: null,
  items: [createEmptyItem()],
  generalGuidance: '',
  additionalNotes: 'Se persistirem os sintomas, procurar um Pronto Atendimento.',
};

const PrescriptionContext = createContext<PrescriptionContextValue | undefined>(
  undefined,
);

export function PrescriptionProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<PrescriptionFormData>(initialState);

  const value = useMemo<PrescriptionContextValue>(
    () => ({
      data: formData,
      setData: setFormData,
      clearData: () =>
        setFormData({
          ...initialState,
          items: [createEmptyItem()],
        }),
    }),
    [formData],
  );

  return (
    <PrescriptionContext.Provider value={value}>
      {children}
    </PrescriptionContext.Provider>
  );
}

export function usePrescription() {
  const context = useContext(PrescriptionContext);
  if (!context) {
    throw new Error('usePrescription must be used dentro de um PrescriptionProvider');
  }
  return context;
}
