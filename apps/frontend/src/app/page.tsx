// Endereço: apps/frontend/src/app/page.tsx (versão refatorada)
'use client';

import { PublicLayout } from "@/components/PublicLayout";
import { useContext, useState } from 'react';
import { AuthContext } from '@/contexts/AuthProvider';
import { useRouter } from "next/navigation";
import axios from "axios"; // 1. IMPORTAMOS O AXIOS PARA VERIFICAR O TIPO DE ERRO

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 2. ADICIONAMOS UM ESTADO PARA CONTROLAR A MENSAGEM DE ERRO
  const [error, setError] = useState<string | null>(null);
  // Adicionamos um estado de loading para dar feedback visual no botão
  const [isLoading, setIsLoading] = useState(false); 

  const { signIn } = useContext(AuthContext);
  const router = useRouter();

  async function handleSignIn(event: React.FormEvent) {
    event.preventDefault();
    setError(null); // Limpa erros anteriores a cada nova tentativa
    setIsLoading(true); // Inicia o estado de carregamento

    try {
      await signIn({ email, password });
      router.push('/dashboard');
    } catch (err) {
      // 3. LÓGICA DE TRATAMENTO DE ERRO INTELIGENTE
      if (axios.isAxiosError(err)) {
        // Se o servidor respondeu, mas com erro (ex: 401 Unauthorized)
        if (err.response) {
          setError('E-mail ou senha incorretos. Por favor, verifique suas credenciais.');
        } 
        // Se não houve resposta (servidor offline, problema de rede)
        else {
          setError('Falha na comunicação com o servidor. Tente novamente mais tarde.');
        }
      } 
      // Para qualquer outro tipo de erro inesperado
      else {
        setError('Ocorreu um erro inesperado. Por favor, contate o suporte.');
        console.error("Erro não-axios no login:", err); // Log para depuração
      }
    } finally {
      setIsLoading(false); // Finaliza o estado de carregamento, independentemente do resultado
    }
  }

  return (
    <PublicLayout>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md">
            <div className="p-8 bg-white rounded-lg shadow-md space-y-6">
                <h1 className="text-center text-3xl font-bold text-gray-800">
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

                    {/* 4. ÁREA PARA EXIBIR A MENSAGEM DE ERRO */}
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
    </PublicLayout>
  );
}