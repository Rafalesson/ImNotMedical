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
              className="flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Validar Receita
            </button>
          </div>
        </form>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-gray-300 p-6 text-gray-500">
            <Image src="/loading.svg" alt="Carregando" width={48} height={48} />
            <p>Consultando dados da receita...</p>
          </div>
        ) : (
          <ValidationResult
            result={data}
            error={customError}
          />
        )}
      </div>
    </PublicLayout>
  );
}
