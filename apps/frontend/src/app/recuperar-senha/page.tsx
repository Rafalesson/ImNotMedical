// Endereço: apps/frontend/src/app/recuperar-senha/page.tsx (versão com card estruturado)
'use client';

import { useState } from 'react';
import { PublicLayout } from '@/components/PublicLayout';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setMessage({
      type: 'success',
      text: 'Se um usuário com este e-mail existir em nosso sistema, um link para redefinição de senha foi enviado.'
    });
    setIsLoading(false);
  }

  return (
    <PublicLayout>
      <div className="w-full max-w-md">
        {message?.type === 'success' ? (
          // Card de Sucesso, com a mesma estrutura
          <div className="rounded-lg bg-white shadow-lg flex flex-col overflow-hidden">
            <div className="flex-none flex items-center p-4 border-b border-gray-200">
              <Link href="/login" className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
            </div>
            <div className="flex-grow p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-800">Verifique seu e-mail</h1>
              <p className="mt-4 text-gray-600">{message.text}</p>
            </div>
          </div>
        ) : (
          // Card do Formulário
          // 1. O card principal agora é um container flex-col.
          //    'overflow-hidden' garante que os cantos arredondados funcionem bem.
          <div className="rounded-lg bg-white shadow-lg flex flex-col overflow-hidden">
            
            {/* 2. CABEÇALHO DO CARD */}
            {/* 'flex-none' diz para ele ter a altura de seu conteúdo (definido pelo padding 'p-4'). */}
            <div className="flex-none flex items-center pl-4 border-b border-gray-200">
              <Link
                href="/login"
                className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                aria-label="Voltar para o login"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
            </div>

            {/* 3. CORPO DO CARD */}
            {/* 'flex-grow' faz esta área ocupar todo o resto do espaço.
                'p-8' aplica o espaçamento interno para o conteúdo. */}
            <div className="flex-grow p-8">
              <div className="text-center">
                <h1 className="mb-2 text-2xl font-bold text-gray-800">
                  Recuperar sua senha
                </h1>
                <p className="mb-6 text-gray-500">
                  Sem problemas! Digite seu e-mail abaixo e enviaremos um link para você criar uma nova senha.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="email" className="block text-left text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-gray-300 p-3 text-gray-900" required />
                </div>
                {message?.type === 'error' && (
                  <p className="text-sm text-red-600">{message.text}</p>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-md bg-blue-600 py-3 text-white font-semibold shadow-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </button>
              </form>
            </div>

          </div>
        )}
      </div>
    </PublicLayout>
  );
}