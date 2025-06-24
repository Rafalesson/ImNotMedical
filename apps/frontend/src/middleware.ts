// Endereço: apps/frontend/src/middleware.ts (versão final com tratamento de erro)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Função para obter a chave secreta de forma segura
function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Este erro acontecerá no servidor se a variável de ambiente não for definida
    throw new Error('JWT_SECRET não está definido nas variáveis de ambiente!');
  }
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('zello.token')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard'];
  const publicRoutes = ['/login', '/cadastro', '/recuperar-senha', '/redefinir-senha'];

  // Se não há token e o usuário tenta acessar uma rota protegida...
  if (!token && protectedRoutes.some(p => pathname.startsWith(p))) {
    // ...redireciona para o login.
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (token) {
    try {
      const { payload } = await jwtVerify(token, getJwtSecretKey());
      const userRole = payload.role as string;

      // Se um PACIENTE tenta acessar o dashboard de médico...
      if (userRole === 'PATIENT' && pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/paciente/dashboard', request.url));
      }

      // Se um usuário JÁ LOGADO tenta acessar as páginas de login/cadastro...
      if (publicRoutes.some(p => pathname.startsWith(p))) {
        const dashboardUrl = userRole === 'DOCTOR' ? '/dashboard' : '/paciente/dashboard';
        return NextResponse.redirect(new URL(dashboardUrl, request.url));
      }

    } catch (error) {
      // ESTA É A MUDANÇA PRINCIPAL
      // Se o token for inválido, redirecionamos para o login COM uma mensagem de erro.
      console.error("Token inválido ou expirado:", error);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'session_expired');
      
      const response = NextResponse.redirect(loginUrl);
      // Limpa o cookie inválido do navegador do usuário
      response.cookies.delete('zello.token');
      return response;
    }
  }

  return NextResponse.next();
}

// O matcher continua o mesmo, mas agora cobre todas as nossas rotas.
export const config = {
  matcher: ['/dashboard/:path*', '/paciente/dashboard/:path*', '/login', '/cadastro/:path*', '/recuperar-senha', '/redefinir-senha'],
};