// Endereço: apps/frontend/src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. A função principal do middleware
export function middleware(request: NextRequest) {
  // 2. Pegamos o token de autenticação dos cookies da requisição
  const token = request.cookies.get('zello.token')?.value;

  // 3. Pegamos a URL que o usuário está tentando acessar
  const { pathname } = request.nextUrl;

  // 4. LÓGICA DE REDIRECIONAMENTO
  // Se o usuário NÃO tem token e está tentando acessar qualquer rota dentro do /dashboard...
  if (!token && pathname.startsWith('/dashboard')) {
    // ...redirecionamos ele para a nova página de login.
    // A 'request.url' é a URL base do seu site.
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se o usuário TEM um token e está tentando acessar a página de login...
  if (token && pathname === '/login') {
    // ...redirecionamos ele para o dashboard, pois ele já está logado.
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 5. Se nenhuma das condições acima for atendida, a requisição continua normalmente.
  return NextResponse.next();
}

// 6. CONFIGURAÇÃO DO MATCHER
// Isso diz ao middleware para rodar APENAS nas rotas que nos interessam.
// Evita que ele rode em requisições de imagens, CSS, etc., melhorando a performance.
export const config = {
  matcher: [
    '/dashboard/:path*', // Todas as rotas dentro de /dashboard
    '/login',            // A rota de login
  ],
};