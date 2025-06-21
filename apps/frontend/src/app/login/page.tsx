// Endereço: apps/frontend/src/app/login/page.tsx (versão final e correta)
'use client';

import { PublicLayout } from "@/components/PublicLayout";
import { useContext, useState } from 'react';
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

  // ESTA É A FUNÇÃO COMPLETA E CORRETA
  async function handleSignIn(event: React.FormEvent) {
    event.preventDefault();
    setError(null); 
    setIsLoading(true);

    try {
      // 1. Tentamos fazer o login
      await signIn({ email, password });

      // 2. Se o 'await' acima NÃO der erro, significa que o login foi bem-sucedido.
      //    Então, nós mesmos fazemos o redirecionamento.
      router.push('/dashboard');

    } catch (err) {
      // 3. Se o 'signIn' lançar um erro, este 'catch' irá pegá-lo.
      //    Agora, nossa lógica inteligente para exibir a mensagem correta funciona.
      if (axios.isAxiosError(err)) {
        if (err.response) { // Erro de negócio (ex: 401)
          setError('E-mail ou senha incorretos. Por favor, verifique suas credenciais.');
        } else { // Erro de rede (backend offline)
          setError('Falha na comunicação com o servidor. Tente novamente mais tarde.');
        }
      } else { // Outro tipo de erro
        setError('Ocorreu um erro inesperado. Por favor, contate o suporte.');
        console.error("Erro desconhecido no login:", err);
      }
    } finally {
      // 4. Independentemente do resultado, paramos o loading.
      setIsLoading(false); 
    }
  }

  return (
    <PublicLayout>
      <div className="flex items-center justify-center py-12 px-4">
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

                    {/* Área que exibe a mensagem de erro na tela */}
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
                      {/* Mostra 'Entrando...' quando está carregando */}
                      {isLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
      </div>
    </PublicLayout>
  );
}