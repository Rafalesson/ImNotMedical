// Endereço: apps/frontend/src/app/login/page.tsx
'use client';

import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/contexts/AuthProvider';
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); 

  const { signIn } = useContext(AuthContext);
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'session_expired') {
      setError('Sua sessão expirou ou é inválida. Por favor, faça o login novamente.');
    }
  }, [searchParams]);

  async function handleSignIn(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await signIn({ email, password });
    } catch (_error) {
      setError('E-mail ou senha incorretos. Por favor, verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div 
        className="hidden lg:block w-1/2 bg-cover bg-center"
        style={{ backgroundImage: 'url(/login_img.svg)' }}
      />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 inline-block">
            <span className="text-3xl font-bold text-gray-800 tracking-tight">Zello</span>
          </Link>
          
          <div className="space-y-6">
            <h1 className="text-left text-3xl font-bold text-gray-800">
                Acesse sua conta
            </h1>
            <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-gray-300 p-3 text-gray-900" required />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</label>
                    <div className="text-sm">
                      <Link href="/recuperar-senha" className="font-semibold text-blue-600 hover:text-blue-500">
                        Esqueceu a senha?
                      </Link>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-gray-300 p-3 text-gray-900" required />
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full rounded-md bg-blue-600 py-3 text-white font-semibold shadow-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
            <p className="mt-8 text-center text-sm text-gray-500">
              Não tem uma conta?{' '}
              <Link href="/cadastro" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
                Cadastre-se agora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}