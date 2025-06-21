// Endereço: apps/frontend/src/app/validar/page.tsx (versão final)
'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { HelpCircle, Search } from 'lucide-react';
import { ValidationResult } from '@/components/ValidationResult';
import { PublicLayout } from '@/components/PublicLayout';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

const fetchCertificate = async (code: string) => {
  if (!code.trim()) return null;
  const response = await api.get(`/certificates/validate/${code}`);
  return response.data;
};


export default function ValidatePage() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get('codigo') || '';
  const [code, setCode] = useState(codeFromUrl);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['certificate', code],
    queryFn: () => fetchCertificate(code),
    enabled: false,
    retry: 1,
  });

  const handleValidate = (event?: React.FormEvent) => {
    event?.preventDefault();
    refetch();
  };

  useEffect(() => {
    if (codeFromUrl) {
      refetch();
    }
  }, [codeFromUrl, refetch]);

  const customError = error ? 'Atestado não encontrado ou inválido.' : null;

  return (
    <PublicLayout>
      {/* Este é o "card" de conteúdo. Ele é o único filho direto do PublicLayout.
        O PublicLayout é agora o único responsável por centralizá-lo na tela.
        Note que removemos o 'div' extra que tentava controlar o layout daqui.
      */}
      <div className="w-full max-w-xl rounded-lg bg-white p-8 shadow-lg lg:max-w-3xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
          Validador de Documentos
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Insira o código único do documento para verificar sua autenticidade.
        </p>
        <form onSubmit={handleValidate} className="flex items-center space-x-2">
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

        <div className="mt-8 min-h-[200px] flex items-center justify-center">
          {isLoading && <p className="text-gray-500 animate-pulse">Validando...</p>}

          {(data || customError) && !isLoading && <ValidationResult result={data} error={customError} />}

          {!isLoading && !data && !customError && (
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
                height={150}
                className="mx-auto rounded-md border shadow-sm"
              />
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}