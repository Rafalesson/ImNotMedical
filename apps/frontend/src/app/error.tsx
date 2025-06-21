// Endereço: apps/frontend/src/app/error.tsx (versão com layout padronizado)

'use client'; 

import { useEffect } from 'react';
import { Header } from '@/components/Header'; // 1. IMPORTAMOS SEU HEADER
import { Footer } from '@/components/Footer'; // 2. IMPORTAMOS SEU FOOTER
import { AlertOctagon, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    // 3. ESTRUTURA PARA "STICKY FOOTER"
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="flex flex-grow flex-col items-center justify-center px-4 py-20 text-center">
        <AlertOctagon className="mb-4 h-16 w-16 text-red-500" />
        <h1 className="mb-4 text-4xl font-bold text-gray-800">Algo deu errado</h1>
        <p className="max-w-md text-gray-500 mb-8">
          Lamentamos, mas um erro inesperado ocorreu. Nossa equipe já foi notificada. Por favor, tente novamente.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Tentar Novamente
        </button>
      </main>

      <Footer />
    </div>
  );
}