// Endereço: apps/frontend/src/components/Header/index.tsx (versão com 'fixed')
'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { usePathname } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthProvider';
import { LogIn, LayoutDashboard } from 'lucide-react';

export function Header() {
  const { isAuthenticated } = useContext(AuthContext);
  const pathname = usePathname();
  const hideButtonOnRoutes = ['/validar'];
  const shouldHideButton = hideButtonOnRoutes.some(route => pathname.startsWith(route));

  return (
    // MUDANÇA PRINCIPAL:
    // 'fixed': Fixa o header no topo da tela, fora do fluxo de rolagem.
    // 'w-full': Garante que ele ocupe toda a largura.
    // 'bg-white/80 backdrop-blur-sm': Efeito de vidro fosco, muito moderno.
    <header className="fixed top-0 w-full bg-white/80 shadow-sm z-50 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <Link href="/" className="-m-1.5 p-1.5">
          <span className="text-2xl font-bold text-gray-800 tracking-tight">Zello</span>
        </Link>

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