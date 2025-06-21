// Endereço: apps/frontend/src/app/login/page.tsx (versão final com layout split-screen)
'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/contexts/AuthProvider';
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); 

  const { signIn } = useContext(AuthContext);
  const router = useRouter();

  async function handleSignIn(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn({ email, password });
      router.push('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError('E-mail ou senha incorretos. Por favor, verifique suas credenciais.');
        } else {
          setError('Falha na comunicação com o servidor. Tente novamente mais tarde.');
        }
      } else {
        setError('Ocorreu um erro inesperado. Por favor, contate o suporte.');
        console.error("Erro desconhecido no login:", err);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    // Container principal que ocupa a tela inteira e usa flexbox
    <div className="flex min-h-screen bg-white">
      
      {/* ======================================================================= */}
      {/* PAINEL ESQUERDO (IMAGEM)                                                */}
      {/* 'hidden lg:block' faz este painel aparecer apenas em telas grandes (lg) */}
      {/* ======================================================================= */}
      <div 
        className="hidden lg:block w-1/2 bg-contain bg-center"
        style={{ backgroundImage: 'url(/login_img.svg)' }}
      >
        {/* Este painel é puramente visual */}
      </div>

      {/* ======================================================================= */}
      {/* PAINEL DIREITO (FORMULÁRIO)                                             */}
      {/* 'w-full lg:w-1/2' faz o painel ocupar a tela toda no mobile e metade no desktop */}
      {/* ======================================================================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Adicionamos o logo aqui, já que não temos mais o Header */}
          <Link href="/" className="mb-8 inline-block">
            <span className="text-3xl font-bold text-gray-800 tracking-tight">Zello</span>
          </Link>
          
          <div className="space-y-6">
            <h1 className="text-left text-3xl font-bold text-gray-800">
                Acesse sua conta
            </h1>
            <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-gray-300 p-3 text-gray-900" required />
                </div>
                <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">Senha</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-gray-300 p-3 text-gray-900" required />
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
          </div>
        </div>
      </div>
    </div>
  );
}