// Endereço: apps/frontend/src/app/validar/[codigo]/page.tsx

'use client';

// MODIFICAÇÃO: useSearchParams não é mais necessário
import React, { useEffect, useState } from 'react';
import { HelpCircle, Search } from 'lucide-react';
import { ValidationResult } from '@/components/ValidationResult';
import { PublicLayout } from '@/components/PublicLayout';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

const fetchCertificate = async (code: string | null) => {
  // Se o código for nulo ou vazio, não faz a requisição
  if (!code || !code.trim()) return null;
  
  // MODIFICAÇÃO: Chamando o novo endpoint PÚBLICO que criamos no backend
  const response = await api.get(`/certificates/public/validate/${code}`);
  return response.data;
};


// MODIFICAÇÃO: A página agora recebe 'params' para capturar o código da URL
export default function ValidatePage({ params }: { params: { codigo: string } }) {
  // MODIFICAÇÃO: O código da URL vem dos params, não mais do searchParams
  const codeFromUrl = params.codigo || '';
  const [code, setCode] = useState(codeFromUrl);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['certificate', code],
    queryFn: () => fetchCertificate(code),
    // MODIFICAÇÃO: A query agora é ativada se 'code' tiver um valor, 
    // e desativada para a busca automática inicial se o código da URL estiver presente.
    enabled: false, 
    retry: 1,
  });

  const handleValidate = (event?: React.FormEvent) => {
    event?.preventDefault();
    if (code.trim()) {
      refetch();
    }
  };

  // MODIFICAÇÃO: O useEffect agora simplesmente dispara a busca se o código vier da URL.
  useEffect(() => {
    if (codeFromUrl) {
      refetch();
    }
  }, [codeFromUrl, refetch]);

  const customError = error ? 'Atestado não encontrado ou inválido.' : null;

  return (
    <PublicLayout>
      <div className="w-full max-w-xl rounded-lg bg-white p-8 shadow-lg lg:max-w-3xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
          Validador de Atestados
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Insira o código único do documento para verificar sua autenticidade.
        </p>
        <form onSubmit={handleValidate} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-grow rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o código aqui..."
          />
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center whitespace-nowrap rounded-md bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300 sm:h-full"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Validar Atestado'
            )}
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
