// src/app/validar/page.tsx (versão final com seção de ajuda)
'use client';

import { api } from '@/services/api';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle, AlertTriangle, Search, HelpCircle } from 'lucide-react';
import { ValidationResult } from '@/components/ValidationResult';
import { PublicLayout } from '@/components/PublicLayout';
import Image from 'next/image'; // Importamos o componente de Imagem otimizado do Next.js

export default function ValidatePage() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState(searchParams.get('codigo') || '');
  const [result, setResult] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleValidate = useCallback(async (validationCode: string) => {
    if (!validationCode.trim()) return;
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await api.get(`/certificates/validate/${validationCode}`);
      setResult(response.data);
    } catch (err) {
      setError('Atestado não encontrado ou inválido.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const codeFromUrl = searchParams.get('codigo');
    if (codeFromUrl) {
      handleValidate(codeFromUrl);
    }
  }, [searchParams, handleValidate]);

  return (
    <PublicLayout>
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-xl rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
            Validador de Documentos
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Insira o código único do documento para verificar sua autenticidade.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); handleValidate(code); }} className="flex items-center space-x-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-grow rounded-md border border-gray-300 p-3 text-gray-900 focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o código aqui..."
            />
            <button type="submit" disabled={isLoading} className="rounded-md bg-blue-600 p-3 text-white transition hover:bg-blue-700 disabled:bg-blue-300">
              {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Search />}
            </button>
          </form>

          {/* --- LÓGICA DE EXIBIÇÃO ATUALIZADA --- */}
          <div className="mt-8 min-h-[200px] flex items-center justify-center">
            {isLoading && <p className="text-gray-500 animate-pulse">Validando...</p>}
            
            {(result || error) && <ValidationResult result={result} error={error} />}
            
            {/* SE NÃO ESTIVER CARREGANDO E NÃO HOUVER RESULTADO, MOSTRA A DICA */}
            {!isLoading && !result && !error && (
              <div className="w-full rounded-lg border-2 border-dashed border-gray-200 p-6 text-center text-gray-600">
                <HelpCircle className="mx-auto mb-3 h-8 w-8 text-gray-400" />
                <h3 className="font-semibold text-gray-800 mb-2">Onde encontro o código?</h3>
                <p className="text-sm text-gray-500 mb-4">
                  O código de validação está localizado no rodapé do documento em PDF que você recebeu.
                </p>
                <Image
                  src="/dicas.png"
                  alt="Exemplo de onde encontrar o código no atestado"
                  width={500}
                  height={150} // Ajuste a altura conforme necessário
                  className="mx-auto rounded-md border shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}