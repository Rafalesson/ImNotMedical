// Endereço: apps/frontend/src/components/AutocompleteSearch.tsx (versão com debouncing)
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';

type Option = { id: string | number; [key: string]: any; };

type AutocompleteSearchProps<T extends Option> = {
  label: string;
  placeholder: string;
  initialQuery?: string;
  onSearch: (query: string) => Promise<T[]>;
  renderOption: (option: T) => JSX.Element;
  onSelect: (option: T | null) => void;
};

export function AutocompleteSearch<T extends Option>({
  label,
  placeholder,
  initialQuery = '',
  onSearch,
  renderOption,
  onSelect,
}: AutocompleteSearchProps<T>) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<T[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Adicionamos estado de loading

  // Este useEffect agora cuida da lógica de busca com "debouncing"
  useEffect(() => {
    // Se o campo estiver vazio, não fazemos nada aqui. A busca inicial é feita no onFocus.
    if (query.trim() === '' && results.length > 0) {
      setResults([]); // Limpa os resultados se o usuário apagar o texto
      return;
    }

    // Se o texto for o mesmo do valor inicial, não fazemos a busca ainda
    if (query === initialQuery && initialQuery !== '') {
      return;
    }

    setIsLoading(true);
    // Criamos um "timer". A busca só acontece 300ms depois que o usuário para de digitar.
    const timerId = setTimeout(() => {
      onSearch(query).then(searchResult => {
        setResults(searchResult);
        setIsLoading(false);
      });
    }, 300);

    // Esta função de limpeza é essencial: se o usuário digitar outra letra,
    // o timer anterior é cancelado e um novo é criado.
    return () => {
      clearTimeout(timerId);
      setIsLoading(false);
    };
  }, [query, initialQuery, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSelect(null); // Limpa a seleção anterior ao digitar
  };

  const handleSelect = (option: T) => {
    const mainText = option.name || option.code; 
    setQuery(mainText);
    onSelect(option);
    setResults([]);
    setIsFocused(false);
  };
  
  // Função para buscar os pacientes recentes quando o campo recebe foco
  const handleFocus = async () => {
    setIsFocused(true);
    // Se o campo estiver vazio, busca os recentes.
    if(query.trim() === '') {
      setIsLoading(true);
      const searchResult = await onSearch('');
      setResults(searchResult);
      setIsLoading(false);
    }
  }

  return (
    <div className="relative" onBlur={() => setTimeout(() => setIsFocused(false), 200)}>
      <label htmlFor={label} className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          id={label}
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus} // Usamos a nova função de foco
          className="w-full rounded-md border border-gray-300 p-3 pl-10 text-gray-900"
          placeholder={placeholder}
          autoComplete="off"
        />
        {/* Podemos adicionar um spinner de loading aqui se quisermos */}
      </div>
      {isFocused && results.length > 0 && (
        <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {results.map((option) => (
            <li key={option.id} onMouseDown={() => handleSelect(option)}>
              {renderOption(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}