// Endereço: apps/frontend/src/hooks/useDebounce.ts
'use client';

import { useState, useEffect } from 'react';

// Este hook aceita um valor (o que o usuário está digitando) e um delay em milissegundos
export function useDebounce<T>(value: T, delay: number): T {
  // O estado que vai guardar o valor "atrasado" (debounced)
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Cria um timer que só vai atualizar o estado 'debouncedValue' após o 'delay'
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Função de limpeza: se o usuário digitar outra letra (o 'value' mudar),
    // o timer anterior é cancelado e um novo é criado.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // O efeito só roda se o valor ou o delay mudarem

  return debouncedValue;
}