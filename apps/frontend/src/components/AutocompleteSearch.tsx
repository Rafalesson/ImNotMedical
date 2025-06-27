// Endereço: apps/frontend/src/components/AutocompleteSearch.tsx (VERSÃO FINAL E CORRIGIDA)
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';

// Tipagem permanece a mesma
type Option = { id: string | number; [key: string]: any; };

// 1. ALTERAÇÃO NAS PROPS:
//    - Trocamos 'initialQuery' por 'initialValue' para aceitar um objeto.
//    - Adicionamos 'displayValue' para saber como exibir o objeto.
type AutocompleteSearchProps<T extends Option> = {
  label: string;
  placeholder: string;
  initialValue?: T | null; // <-- MUDOU DE initialQuery: string
  displayValue: (option: T) => string; // <-- ADICIONADO
  onSearch: (query: string) => Promise<T[]>;
  renderOption: (option: T) => JSX.Element;
  onSelect: (option: T | null) => void;
};

export function AutocompleteSearch<T extends Option>({
  label,
  placeholder,
  initialValue = null, // <-- MUDOU
  displayValue, // <-- ADICIONADO
  onSearch,
  renderOption,
  onSelect,
}: AutocompleteSearchProps<T>) {

  // 2. ALTERAÇÃO NO ESTADO INICIAL:
  //    - O 'query' (texto do input) agora é inicializado a partir do objeto 'initialValue'.
  const [query, setQuery] = useState(initialValue ? displayValue(initialValue) : '');
  const [results, setResults] = useState<T[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 3. ADIÇÃO DE NOVO USEEFFECT:
  //    - Este hook garante que, se o valor inicial mudar, o texto no input também mude.
  //    - Essencial para o nosso Context funcionar 100%.
  useEffect(() => {
    setQuery(initialValue ? displayValue(initialValue) : '');
  }, [initialValue, displayValue]);


  // O useEffect de busca com debouncing continua o mesmo, mas ajustamos uma condição
  useEffect(() => {
    // Se o texto do input for igual ao que deveria ser exibido pelo valor inicial, não busca.
    if (initialValue && query === displayValue(initialValue)) {
        setResults([]);
        return;
    }

    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const timerId = setTimeout(() => {
      setIsLoading(true);
      onSearch(query).then(searchResult => {
        setResults(searchResult);
        setIsLoading(false);
      });
    }, 300);

    return () => {
      clearTimeout(timerId);
      setIsLoading(false); // Garante que o loading para se o componente for desmontado
    };
  }, [query, initialValue, displayValue, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // Se o usuário apaga o texto, a seleção é invalidada
    if (e.target.value === '') {
        onSelect(null);
    }
  };

  const handleSelect = (option: T) => {
    // 4. ALTERAÇÃO NO HANDLESELECT:
    //    - Usa a função 'displayValue' para garantir consistência.
    setQuery(displayValue(option));
    onSelect(option);
    setResults([]);
    setIsFocused(false);
  };
  
  const handleFocus = async () => {
    setIsFocused(true);
    if(query.trim() === '') {
      setIsLoading(true);
      const searchResult = await onSearch('');
      setResults(searchResult);
      setIsLoading(false);
    }
  }

  // O JSX/HTML continua o mesmo
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
          onFocus={handleFocus}
          className="w-full rounded-md border border-gray-300 p-3 pl-10 text-gray-900"
          placeholder={placeholder}
          autoComplete="off"
        />
      </div>
      {isFocused && (isLoading ? (
            <div className="absolute z-20 w-full mt-1 p-4 bg-white border border-gray-300 rounded-md shadow-lg text-center text-gray-500">
                Carregando...
            </div>
        ) : results.length > 0 && (
        <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {results.map((option) => (
            <li key={option.id} onMouseDown={() => handleSelect(option)}>
              {renderOption(option)}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}