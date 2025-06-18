// src/components/AutocompleteSearch.tsx
'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => { setQuery(initialQuery); }, [initialQuery]);

  const handleSearch = async (searchQuery: string) => {
    const searchResult = await onSearch(searchQuery);
    setResults(searchResult);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSelect(null);
    if (newQuery.length > 2) {
      handleSearch(newQuery);
    } else {
      setResults([]);
    }
  };

  const handleSelect = (option: T) => {
    onSelect(option);
    // Extrai o texto principal do 'renderOption' para preencher o input
    const mainText = option.name || option.code; 
    setQuery(mainText);
    setResults([]);
    setIsFocused(false);
  };

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
          onFocus={() => { setIsFocused(true); handleSearch(''); }}
          className="w-full rounded-md border border-gray-300 p-3 pl-10 text-gray-900"
          placeholder={placeholder}
          autoComplete="off"
        />
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