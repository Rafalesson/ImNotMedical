// Endereço: apps/frontend/src/components/Header/index.tsx (versão com exceção de rota)
'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { usePathname } from 'next/navigation'; // 1. IMPORTAMOS o hook 'usePathname'
import { AuthContext } from '@/contexts/AuthProvider';
import { LogIn, LayoutDashboard } from 'lucide-react';

export function Header() {
  const { isAuthenticated } = useContext(AuthContext);
  const pathname = usePathname(); // 2. PEGAMOS O NOME DA ROTA ATUAL. Ex: '/', '/login', '/validar'

  // 3. DEFINIMOS em quais rotas o botão NÃO deve aparecer.
  // Usar um array torna fácil adicionar mais rotas no futuro, se necessário.
  const hideButtonOnRoutes = ['/validar'];

  // 4. VERIFICAMOS se a rota atual começa com algum dos caminhos da nossa lista de exceções.
  const shouldHideButton = hideButtonOnRoutes.some(route => pathname.startsWith(route));

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <Link href="/" className="-m-1.5 p-1.5">
          <span className="text-2xl font-bold text-gray-800 tracking-tight">Zello</span>
        </Link>

        {/* 5. ADICIONAMOS A CONDIÇÃO: só renderizamos o 'div' do botão se 'shouldHideButton' for falso. */}
        {!shouldHideButton && (
          <div>
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Acessar Plataforma
              </Link>
            )}
          </div>
        )}

      </nav>
    </header>
  );
}