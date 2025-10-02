// Endereço: apps/frontend/src/components/Header/index.tsx (versão com botão contextual)
'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { usePathname } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthProvider';

export function Header() {
  // 1. Agora pegamos não só 'isAuthenticated', mas também 'user' e 'signOut'
  const { isAuthenticated, user, signOut } = useContext(AuthContext);
  const pathname = usePathname();
  
  const hideButtonOnRoutes = ['/validar', '/receitas/validar', '/recuperar-senha', '/redefinir-senha', '/cadastro'];
  const shouldHideButton = hideButtonOnRoutes.some(route => pathname.startsWith(route));
  const isValidationRoute = pathname.startsWith('/validar') || pathname.startsWith('/receitas/validar');

  return (
    <header className="sticky top-0 w-full bg-white shadow-sm z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {isValidationRoute ? (
          <div className="-m-1.5 p-1.5 cursor-default" aria-disabled="true">
            <span className="text-2xl font-bold text-gray-800 tracking-tight">Zello</span>
          </div>
        ) : (
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold text-gray-800 tracking-tight">Zello</span>
          </Link>
        )}

        {!shouldHideButton && (
          <div>
            {isAuthenticated ? (
              // 2. Lógica condicional baseada no papel do usuário
              user?.role === 'DOCTOR' ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              ) : (
                <button
                  onClick={signOut}
                  className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </button>
              )
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