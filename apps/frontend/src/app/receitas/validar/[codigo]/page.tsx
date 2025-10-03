'use client';

import React, { useEffect, useState } from 'react';
import { HelpCircle, Search } from 'lucide-react';
import { ValidationResult } from '@/components/ValidationResult';
import { PublicLayout } from '@/components/PublicLayout';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

const fetchPrescription = async (code: string | null) => {
  if (!code || !code.trim()) {
    return null;
  }

  const response = await api.get(`/prescriptions/public/validate/${code}`);
  return response.data;
};

export default function PrescriptionValidatePage({
  params,
}: {
  params: { codigo: string };
}) {
  const codeFromUrl = params.codigo || '';
  const [code, setCode] = useState(codeFromUrl);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['prescription', code],
    queryFn: () => fetchPrescription(code),
    enabled: false,
    retry: 1,
  });

  const handleValidate = (event?: React.FormEvent) => {
    event?.preventDefault();
    if (code.trim()) {
      refetch();
    }
  };

  useEffect(() => {
    if (codeFromUrl) {
      refetch();
    }
  }, [codeFromUrl, refetch]);

  const customError = error ? 'Receita não encontrada ou inválida.' : null;

  return (
    <PublicLayout>
      <div className="w-full max-w-xl rounded-lg bg-white p-8 shadow-lg lg:max-w-3xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
          Validador de Receitas Médicas
        </h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          Informe o código da receita ou leia o QR Code presente no documento.
        </p>

        <form onSubmit={handleValidate} className="mb-6 flex flex-col gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Search className="h-4 w-4 text-blue-500" />
            Código da receita
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Ex: RX8H2L9Q"
              className="w-full rounded-md border border-gray-300 p-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="submit"
              className="flex items-center justify-center whitespace-nowrap rounded-md bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Validar Receita
            </button>
          </div>
        </form>

        <div className="mt-8 min-h-[200px] flex items-center justify-center">
          {isLoading && <p className="text-gray-500 animate-pulse">Validando...</p>}

          {(data || customError) && !isLoading && (
            <ValidationResult result={data} error={customError} />
          )}

          {!isLoading && !data && !customError && (
            <div className="w-full rounded-lg border-2 border-dashed border-gray-200 p-6 text-center text-gray-600">
              <HelpCircle className="mx-auto mb-3 h-8 w-8 text-gray-400" />
              <h3 className="mb-2 font-semibold text-gray-800">Onde encontro o código?</h3>
              <p className="mb-4 text-sm text-gray-500">
                O código de validação está localizado no rodapé da receita em PDF que você recebeu.
              </p>
              <Image
                src="/assets/dica_codigo.png"
                alt="Exemplo de onde encontrar o código na receita"
                width={600}
                height={200}
                className="mx-auto rounded-md border shadow-sm"
              />
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
