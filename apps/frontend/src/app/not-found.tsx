// Endereço: apps/frontend/src/app/not-found.tsx (versão com layout padronizado)

import Link from 'next/link';
import { Header } from '@/components/Header'; // 1. IMPORTAMOS SEU HEADER
import { Footer } from '@/components/Footer'; // 2. IMPORTAMOS SEU FOOTER
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    // 3. ESTRUTURA PARA "STICKY FOOTER"
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      {/* O conteúdo principal cresce para preencher o espaço, empurrando o rodapé para baixo */}
      <main className="flex flex-grow flex-col items-center justify-center px-4 py-20 text-center">
        <AlertTriangle className="mb-4 h-16 w-16 text-yellow-500" />
        <h1 className="mb-2 text-4xl font-bold text-gray-800">Erro 404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">Página Não Encontrada</h2>
        <p className="max-w-md text-gray-500 mb-8">
          Oops! A página que você busca não existe, foi movida ou está indisponível.
        </p>
        <Link href="/dashboard" className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700">
          <Home className="mr-2 h-5 w-5" />
          Voltar ao Início
        </Link>
      </main>

      <Footer />
    </div>
  );
}